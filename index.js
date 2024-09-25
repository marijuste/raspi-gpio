var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const gpioMap = new Map([
  ["1", { primary: 24, alt: 536 }],
  ["2", { primary: 13, alt: 524 }],
  ["3", { primary: 25, alt: 537 }],
  ["4", { primary: 23, alt: 535 }],
])
const gpos = [
  { id: "1", gpo: undefined }, // 24
  { id: "2", gpo: undefined }, // 13
  { id: "3", gpo: undefined }, // 25
  { id: "4", gpo: undefined }, // 23
];
try {
  gpos.forEach((gpo) => {
    gpo.gpo = new Gpio(gpioMap.get(gpo.id).primary, "out")
  })

} catch (error) {
  console.error(`Error initializing GPIO in standard mode: ${error.message}  ..using alt numbers now.`);
  gpos.forEach((gpo) => {
    gpo.gpo = new Gpio(gpioMap.get(gpo.id).alt, "out")
  })
}
const PORT = 9091;
const HOST = "0.0.0.0";

server.on("message", (msg, rinfo) => {
  const rawMessage = msg.toString().split("\n");
  const message = rawMessage[0] ? rawMessage[0].split(":") : [];

  if (message.length === 3) {
    const gpoMessage = message[1];
    const stateMessage = message[2];
    gpos.forEach((gpo) => {
      if (gpo.id === gpoMessage) {
        console.log(stateMessage === "ON" ? 1 : 0);
        gpo.gpo.writeSync(stateMessage === "ON" ? 1 : 0);
      }
    });
  }
});
server.on("error", (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});
server.on("listening", () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

function unexportOnClose() {
  gpos.forEach((gpo) => {
    gpo.gpo.writeSync(0);
    gpo.gpo.unexport();
  });
}

server.bind(PORT, HOST);
process.on("SIGINT", unexportOnClose);
