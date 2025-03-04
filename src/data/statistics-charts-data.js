import { chartsConfig } from "@/configs";
import axios from 'axios';

export const ShowVisitAPI = async () => {
  try {
    const result = await axios.get(`http://localhost:3000/api/log/visits/7days`);
    return result.data;
  } catch (err) {
    console.error('Error select log', err);
    return 0;
  }
};
const ShowVisit = await ShowVisitAPI();
const dataArray = Object.values(ShowVisit);

// ฟังก์ชันสำหรับสร้าง array ของวันที่ย้อนหลัง 7 วัน พร้อม mark วันนี้ และทำตัวหนา
const getPast7DaysWithTodayMark = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = i === 0 ? `${dayOfWeek} (Today)` : dayOfWeek; // ทำตัวหนาสำหรับวันนี้
    days.push(formattedDate);
  }
  return days;
};

// สร้างข้อมูลการเข้าชมและสีของแท่งสำหรับ 7 วันที่ผ่านมา
const generateViewsAndColors = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const value = dataArray[i];
    const color = i === 6 ? "#ff9800" : "#388e3c";
    data.push({
      x: getPast7DaysWithTodayMark()[i],
      y: value,
      fillColor: color,
    });
  }
  return data;
};

const websiteViewsChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Views",
      data: generateViewsAndColors(),
    },
  ],
  options: {
    ...chartsConfig,
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      labels: {
        ...chartsConfig.xaxis.labels,
        formatter: function (value) {
          return value; // ใช้ formatter เพื่อแสดง HTML
        },
      },
    },
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Number of user visits for the past 7 days",
    chart: websiteViewsChart,
  },
];

export default statisticsChartsData;