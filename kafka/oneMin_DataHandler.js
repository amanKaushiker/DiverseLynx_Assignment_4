const { timeExtractor } = require("./../helper_functions/timeExtractor");
const WebSocket = require("ws");
const wss = require("./websocket_Server");

let minSlot;
const currentSlotData = {
  open: null,
  close: null,
  low: null,
  high: null,
  timestamp: null,
};

exports.eachMinDataSaver = (val) => {
  const rawData = JSON.parse(val);
  const hourMinFormat = timeExtractor(rawData.data.T);
  //let currentSlot = `${hourMinFormat.hours}:${hourMinFormat.minutes}`;
  let currentSlot = hourMinFormat.minutes;

  if (minSlot == undefined) {
    minSlot = currentSlot;
    currentSlotData.open = Number(rawData.data.p);
    currentSlotData.close = Number(rawData.data.p);
    currentSlotData.low = Number(rawData.data.p);
    currentSlotData.high = Number(rawData.data.p);
    currentSlotData.timestamp = Number(rawData.data.T);
  } else if (minSlot === currentSlot) {
    //console.log("//=== SameValue ======//");
    if (Number(rawData.data.p) < currentSlotData.low)
      currentSlotData.low = Number(rawData.data.p);

    if (Number(rawData.data.p) > currentSlotData.high)
      currentSlotData.high = Number(rawData.data.p);

    currentSlotData.close = Number(rawData.data.p);
  } else if (minSlot != currentSlot) {
    console.log("//========= New Minute arrived =========//");
    minSlot = hourMinFormat.minutes;

    console.log("Old min : ", {
      _id:
        currentSlotData.timestamp -
        Math.floor(currentSlotData.timestamp % 60000),
      open: currentSlotData.open,
      high: currentSlotData.high,
      low: currentSlotData.low,
      close: currentSlotData.close,
    });

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            _id:
              currentSlotData.timestamp -
              Math.floor(currentSlotData.timestamp % 60000),
            open: currentSlotData.open,
            high: currentSlotData.high,
            low: currentSlotData.low,
            close: currentSlotData.close,
          })
        );
      }
    });

    currentSlotData.open = currentSlotData.close; ///==> close is equals to new min open
    currentSlotData.close = Number(rawData.data.p);
    currentSlotData.low = Number(rawData.data.p);
    currentSlotData.high = Number(rawData.data.p);
    currentSlotData.timestamp = Number(rawData.data.T);
  }
};
