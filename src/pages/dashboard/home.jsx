import React, { useEffect, useState } from "react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsCardsData, statisticsChartsData } from "@/data";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [chartsData, setChartsData] = useState([]);
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        const role = sessionStorage.getItem("role");
        if (role === "teacher") {
          navigate("/teacher/home");
        } else if (role === null) {
          navigate("/auth/sign-in");
        }
      } catch (error) {
        console.error("Error accessing sessionStorage:", error);
        navigate("/auth/sign-in");
      }
    };

    checkRoleAndRedirect();
  }, [navigate]);

  useEffect(() => {
    const loadChartsData = async () => {
      const data = await statisticsChartsData();
      setChartsData(data);
    };

    loadChartsData();
  }, []);

  useEffect(() => {
    const loadCardsData = async () => {
      const data = await statisticsCardsData();
      setCardsData(data);
    };

    loadCardsData();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-5">
        {cardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6">
        {chartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;