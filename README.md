# raspi-gpio

A task that receives udp-commands on port 9091, and switches a GPO according to the message.

## Install

go to homedirectory

```
cd
```

install dependencies

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install git
```

clone repository

```
git clone https://github.com/marijuste/raspi-gpio.git
```

enter repository

```
cd raspi-gpio
```

install project dependencies

```
npm install
```

start programm

```
node index.js
```

## Use with companion

Add a generic udp-connection in companion.

![add](img/add_connection.PNG)

Enter the the desired ip of your raspberry and port 9091.

![setup](img/setup_connection.PNG)

Send following string to switch gpos

![use](img/use_udp.PNG)

| Message | Number | On  | Off | GPIO RASPI |
| ------- | ------ | --- | --- | ---------- |
| GPO     | 1      | ON  | OFF | GPIO24     |
| GPO     | 2      | ON  | OFF | GPIO13     |
| GPO     | 3      | ON  | OFF | GPIO25     |
| GPO     | 4      | ON  | OFF | GPIO23     |

## Autostart

go to homedirectroy

```
cd
```

enter this line to create a file

```
sudo nano /etc/systemd/system/gpio-remote.service
```

paste this into the file, replace `<your-username>` with your username eg. pi.

```
[Unit]
Description=raspi-gpio
After=network.target

[Service]
ExecStart=/usr/bin/node /home/<your-username>/raspi-gpio/index.js
WorkingDirectory=/home/<your-username>/raspi-gpio
Restart=always
User=pi
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Ctrl + X to exit

enter this line to relouad the daemon

```
sudo systemctl daemon-reload
```

enter this line to put in autostart

```
sudo systemctl enable gpio-remote.service
```

reboot and find out if it's working

```
sudo reboot
```
