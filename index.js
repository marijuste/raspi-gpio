var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const gpos = [
  { id: "1", gpo: new Gpio(536, "out") },
  { id: "2", gpo: new Gpio(524, "out") },
  { id: "3", gpo: new Gpio(537, "out") },
  { id: "4", gpo: new Gpio(535, "out") },
];
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
        console.log(stateMessage === "ON" ? 1 : 0)
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

    gpos.forEach((gpo)=>{
        gpo.gpo.writeSync(0);
        gpo.gpo.unexport();
    })
}

server.bind(PORT, HOST);
  process.on('SIGINT', unexportOnClose);