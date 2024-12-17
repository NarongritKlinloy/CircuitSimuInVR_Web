import {
  BanknotesIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Users",
    value: "300",
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
    value: "3",
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
    value: "1",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
