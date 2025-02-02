import {
  BanknotesIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { collapse } from "@material-tailwind/react";
import axios from 'axios';

export const countUserAPI = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/user/count');
        //console.log(response.data);
        return response.data.count;
    } catch (error) {
        console.error("Error counting user:", error);
        return 0;
    }
};
const user_count = await countUserAPI();

export const countAdminAPI = async () => {
  try {
      const response = await axios.get('http://localhost:5000/api/admin/count');
      //console.log(response.data);
      return response.data.count;
  } catch (error) {
      console.error("Error counting admin:", error);
      return 0;
  }
};
const admin_count = await countAdminAPI();

export const countReportAPI = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/report/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting report:", error);
    return 0;
  }
};
const report_count = await countReportAPI();

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Users",
    value: user_count,
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: DocumentTextIcon,
    title: "Total report",
    value: report_count,
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: UserIcon,
    title: "Admin",
    value: admin_count,
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
