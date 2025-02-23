import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router-dom";

const MilkProductionChart = () => {
  const location = useLocation();
  const { milkData } = location.state || [];
  console.log(location.state);
  console.log(milkData);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        title: {
          text: "Litros de Leche",
          style: { color: "#ffffff" },
        },
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ["#5e35b1"],
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)} litros`,
        },
      },
      legend: {
        labels: {
          colors: "#ffffff",
        },
      },
    },
  });

  const [dailySummary, setDailySummary] = useState({
    totalProduction: [],
    maxProductionDay: { day: "N/A", liters: 0 },
    minProductionDay: { day: "N/A", liters: 0 },
    bestCowPerDay: {},
  });

  useEffect(() => {
    if (!milkData || milkData.length === 0) return;

    let groupedData = {};
    milkData.forEach(({ dia, vaca, litros }) => {
      if (!groupedData[dia]) groupedData[dia] = [];
      groupedData[dia].push({ vaca, litros });
    });

    let dailyProduction = [];
    let maxProductionDay = { day: "N/A", liters: 0 };
    let minProductionDay = { day: "N/A", liters: Infinity };
    let bestCowPerDay = {};

    Object.keys(groupedData).forEach((day) => {
      let cows = groupedData[day];
      let totalLiters = cows.reduce((sum, cow) => sum + cow.litros, 0);
      dailyProduction.push({ day, liters: totalLiters });

      if (totalLiters > maxProductionDay.liters) {
        maxProductionDay = { day, liters: totalLiters };
      }
      if (totalLiters < minProductionDay.liters) {
        minProductionDay = { day, liters: totalLiters };
      }

      let maxMilk = Math.max(...cows.map((cow) => cow.litros));
      let topCows = cows
        .filter((cow) => cow.litros === maxMilk)
        .map((cow) => cow.vaca);

      bestCowPerDay[day] = topCows;
    });

    setChartData((prevState) => ({
      ...prevState,
      series: [
        {
          name: "Litros de Leche",
          data: dailyProduction.map((d) => d.liters),
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: dailyProduction.map((d) => d.day),
        },
      },
    }));

    setDailySummary({
      totalProduction: dailyProduction,
      maxProductionDay,
      minProductionDay,
      bestCowPerDay,
    });
  }, [milkData]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        Producción de Leche por Día
      </h2>
      <div
        style={{
          width: "80%",
          maxWidth: "800px",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 15px rgba(94, 53, 177, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        {chartData.series.length > 0 && (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        )}
      </div>

      <h3 style={{ textAlign: "center", marginTop: "30px", color: "#fff" }}>
        📊 Resumen de Producción
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "50px",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)",
            width: "300px",
            textAlign: "center",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 style={{ color: "#5e35b1" }}>Día con Mayor Producción</h4>
          <p>
            {dailySummary.maxProductionDay.day}:{" "}
            {dailySummary.maxProductionDay.liters} litros
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)",
            width: "300px",
            textAlign: "center",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 style={{ color: "#5e35b1" }}>Día con Menor Producción</h4>
          <p>
            {dailySummary.minProductionDay.day}:{" "}
            {dailySummary.minProductionDay.liters} litros
          </p>
        </div>
      </div>

      <h3 style={{ textAlign: "center", marginTop: "30px", color: "#fff" }}>
        🐄 Vaca(s) con Mayor Producción por Día
      </h3>
      {Object.keys(dailySummary.bestCowPerDay || {}).map((day) => (
        <div
          key={day}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)",
            width: "250px",
            textAlign: "center",
            color: "#fff",
            marginTop: "10px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 style={{ color: "#5e35b1" }}>{day}</h4>
          <p>🐄 {dailySummary.bestCowPerDay[day].join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default MilkProductionChart;
