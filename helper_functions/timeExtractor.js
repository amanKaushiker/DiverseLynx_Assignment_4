// exports.timeExtractor = (unixTimeStamp) => {
//   const date = new Date(unixTimeStamp);
//   return {
//     hours: date.getHours(),
//     minutes: date.getMinutes(),
//     seconds: date.getSeconds(),
//   };
// };

exports.timeExtractor = (unixTimeStamp) => {
  return {
    hours: Math.floor((unixTimeStamp / 1000 / 60 / 60) % 24),
    minutes: Math.floor((unixTimeStamp / 1000 / 60) % 60),
    seconds: Math.floor((unixTimeStamp / 1000) % 60),
  };
};

exports.timeStamp_RoundOff = (unixTimeStamp) => {
  return unixTimeStamp - Math.floor(unixTimeStamp % 60000);
};
