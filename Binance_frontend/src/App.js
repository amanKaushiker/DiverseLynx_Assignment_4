import "./App.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axiosInstance from "./Api/Api";

function App() {
  const [ws, setWs] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [available, setAvailable] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("daat : ", event.data);
      setAvailable(event.data);
      if (items.length < 10) {
        const dataArr = items;
        dataArr.push(JSON.parse(event.data));
        setItems([...items, dataArr]);
      } else if (items.length >= 10) {
        console.log("//=== length above 10 ===//");
        const dataArr = items;
        dataArr.shift();
        dataArr.push(JSON.parse(event.data));
        setItems([...items, dataArr]);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);
  //====================================================//

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    console.log("//========== after fetch ===========// ");
    if (available && items && items.length > 0) {
      let data = {};

      const openDataArr = [];
      const highDataArr = [];
      const lowDataArr = [];
      const closeDataArr = [];
      const openLabelsArr = [];
      const highLabelsArr = [];
      const lowLabelsArr = [];
      const closeLabelsArr = [];

      for (let i of items) {
        openDataArr.push(i.open);
        openLabelsArr.push("Market");
      }

      for (let i of items) {
        highDataArr.push(i.high);
        highLabelsArr.push("green");
      }

      for (let i of items) {
        lowDataArr.push(i.low);
        lowLabelsArr.push("green");
      }

      for (let i of items) {
        closeDataArr.push(i.close);
        closeLabelsArr.push("green");
      }

      // Sample data
      data = {
        labels: openLabelsArr,
        datasets: [
          {
            label: "Open",
            data: openDataArr,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
          {
            label: "High",
            data: highDataArr,
            backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
          {
            label: "Low",
            data: lowDataArr,
            backgroundColor: ["rgba(255, 206, 86, 0.2)"],
            borderColor: ["rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
          {
            label: "Close",
            data: closeDataArr,
            backgroundColor: ["rgba(75, 192, 192, 0.2)"],
            borderColor: ["rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
        ],
      };

      const options = {
        responsive: true,
        legend: {
          display: false,
        },
        type: "bar",
        //   scales: {
        //     y: {
        //       beginAtZero: true
        //     }
        //   }
      };

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      });
    }
  }, [available]);

  return (
    <div className="App">
      <h1>Assignment 4</h1>
      <div>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default App;
