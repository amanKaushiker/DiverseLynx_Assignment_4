const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Kafka = require("node-rdkafka");
const WebSocket = require("ws");

const binanceWebSocketURL = process.env.BINANCE_WEB_SOCKET_URL;
console.log("binance socket : ", binanceWebSocketURL);

let producer;

(function () {
  try {
    producer = new Kafka.Producer({
      "metadata.broker.list": "3.133.74.32:9092", // Kafka broker address
      "queue.buffering.max.messages": 1000000,
    });
    producer.connect();

    producer.on("ready", () => {
      console.log("Kafka producer connected");
    });
  } catch (e) {
    console.log("err : ", e);
    return;
  }
})();

// Function to subscribe to a stream and produce messages
function dataProducer() {
  try {
    const ws = new WebSocket(binanceWebSocketURL);
    ws.on("open", () => {
      console.log(`Connected to ${binanceWebSocketURL} stream`);
    });

    ws.on("message", (data) => {
      //console.log("data", data.toString());
      producer.produce(
        "binance-kafka-topic-3", // Kafka topic
        null,
        Buffer.from(data.toString()),
        null,
        Date.now()
      );
    });

    ws.on("error", (error) => {
      console.error(`Error in ${streamName} stream:`, error);
    });
  } catch (e) {
    console.log("err : ", e);
    return;
  }
}

dataProducer();
