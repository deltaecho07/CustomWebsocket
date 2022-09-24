# node-red-contrib-ws-subscriber-custom-deltaecho07

Custom Websocket for connecting with to a Socket with a Bearer Authentication.

### Installation

```
npm install node-red-contrib-ws-subscriber-custom-deltaecho07
```

Or in NodeRED Manage palette and serarch for `node-red-contrib-ws-subscriber-custom-deltaecho07`

### Usage

#### custom-websocket-subsriber Node

![subscriber](docs/subscriber.png)

Every subscriber node needs

- Websocket-Serveradress
- Bearer Token

If everything is correct the node shows a green dot after deploy. If the dot is red, something went wrong while connecting to the WSS. Check the Logs of Node Red to determine the error.

Incoming messages are delivered in JSON-format.
