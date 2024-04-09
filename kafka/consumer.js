const Kafka = require("node-rdkafka");
const { eachMinDataSaver } = require("./oneMin_DataHandler");

function consumer() {
  try {
    const consumerConfig = {
      "group.id": "Users",
      "metadata.broker.list": "3.133.74.32:9092", // Kafka broker address
      "auto.offset.reset": "earliest", // Start consuming from the earliest message in the topic
    };
    const consumer = new Kafka.KafkaConsumer(consumerConfig);
    consumer.on("ready", async () => {
      console.log("Consumer is ready");
      consumer.subscribe(["binance-kafka-topic-3"]);
      consumer.consume();
    });
    consumer.on("data", (message) => {
      //console.log(`Received message: ${message.value.toString()}`); //${message.value.toString()}
      eachMinDataSaver(message.value.toString());
    });
    consumer.on("event.error", (error) => {
      console.error("Consumer error:", error);
    });
    consumer.connect();
  } catch (e) {
    console.log("Err : ", e);
    return;
  }
}

consumer();
