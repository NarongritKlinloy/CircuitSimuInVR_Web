import { chartsConfig } from "@/configs";
import axios from 'axios';

export const ShowVisitAPI = async () => {
  try {
    const result = await axios.get(`https://smith11.ce.kmitl.ac.th/api/log/visits/7days`);
    return result.data;
  } catch (err) {
    console.error('Error select log', err);
    return 0;
  }
};
const ShowVisit = await ShowVisitAPI();
const dataArray = Object.values(ShowVisit);

export const ShowVisitPracticeAPI = async () => {
  try {
    const result = await axios.get(`http://localhost:5000/api/log/practice/7days`);
    return result.data;

  } catch (error) {
    console.error("Error fetching website views data:", error);
    return 0;
  }
}
const ShowVisitPractice = await ShowVisitPracticeAPI();
const dataPracticeValues = Object.values(ShowVisitPractice);

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

const processDataForChart = () => {
  const processedData = {};
  const allPracticeNames = new Set();

  dataPracticeValues.forEach((dayData, dayIndex) => {
    const date = getPast7DaysWithTodayMark()[dayIndex];
    processedData[date] = {};
    if (Array.isArray(dayData)) {
      dayData.forEach((practice) => {
        processedData[date][practice.practice_name] = practice.count;
        allPracticeNames.add(practice.practice_name);
      });
    }
  });

  return { processedData, allPracticeNames: Array.from(allPracticeNames) };
};

const { processedData, allPracticeNames } = processDataForChart();

const generateSeriesForChart = () => {
  return allPracticeNames.map((practiceName) => {
    const data = getPast7DaysWithTodayMark().map((date) => {
      return processedData[date][practiceName] || 0;
    });
    return {
      name: practiceName,
      data: data,
    };
  });
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

const websiteViewsVisitChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Visits",
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

const websiteViewsPracticeChart = {
  type: "bar",
  height: 220,
  series: generateSeriesForChart(),
  options: {
    ...chartsConfig,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: getPast7DaysWithTodayMark(),
      labels: {
        ...chartsConfig.xaxis.labels,
        formatter: function (value) {
          return value;
        },
      },
    },
    yaxis: {
      title: {
        text: "Visits",
      },
      labels: {
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },
    legend: {
      position: "bottom",
    },
    fill: {
      opacity: 1,
    },
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Number of user visits for the past 7 days",
    chart: websiteViewsVisitChart,
  },
  {
    color: "white",
    title: "Number of user visits practice for the past 7 days",
    chart: websiteViewsPracticeChart,
  },
];

export default statisticsChartsData;