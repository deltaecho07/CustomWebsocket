module.exports = function (RED) {
  function websocketSubscriberNode(config) {
    const WebSocket = require("ws");
    RED.nodes.createNode(this, config);
    let node = this;
    let nodeInstance = null;
    let nodeIsClosing = false;
    let reconnectTimer = null;
    let ws;
    const connectToServer = () => {
      //Create WebSocket Connection
      node.log("Create websocket");
      ws = new WebSocket(`${config.url}`, {
        headers: {
          Authorization: `Bearer ${config.token}`, // your token
        },
      });

      //Connection failed
      ws.onerror = function (err) {
        node.log(err);
        node.error("Could not connect to server", err);
      };
      //Connected
      ws.onopen = function () {
        setStatusGreen();
        node.log("connected");
      };
      //Connection closed
      ws.onclose = function () {
        setStatusRed();
        if (reconnectTimer !== null) {
          clearTimeout(reconnectTimer);
        }
        node.log("Connection closed");
      };
      //Message incoming
      ws.on("message", (message) => {
        node.send(JSON.parse(message));
      });

      return ws;
    };
    //ReconnectHandler
    (function reconnectHandler() {
      nodeInstance = connectToServer();
      nodeInstance.on("close", () => {
        setStatusRed();
        if (reconnectTimer === null && nodeIsClosing === false) {
          node.log("close received. Explicit reconnect attempt in 60 seconds.");
          reconnectTimer = setTimeout(() => {
            reconnectHandler();
            reconnectTimer = null;
          }, 60000);
        } else {
          node.log(
            "Node in flow is shutting down, not attempting to reconenct."
          );
        }

        nodeInstance = null;
      });
    })();
    node.on("close", function (done) {
      setStatusRed();
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
      }
      nodeIsClosing = true;
      ws.close();
      done();
    });
    //Set status connected
    function setStatusGreen() {
      node.status({
        fill: "green",
        shape: "dot",
        text: "connected",
      });
    }
    //Set status disconnected
    function setStatusRed() {
      node.status({
        fill: "red",
        shape: "ring",
        text: "disconnected",
      });
    }
  }
  RED.nodes.registerType(
    "custom-websocket-subscriber",
    websocketSubscriberNode
  );
};
