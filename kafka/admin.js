const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  brokers: ["3.133.74.32:9092"],
});

const admin = kafka.admin();

(async function () {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: "binance-kafka-topic-3",
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
    await admin.disconnect();
  } catch (e) {
    console.log("Err : ", e);
  }
})();
