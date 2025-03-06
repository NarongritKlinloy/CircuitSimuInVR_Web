import React from "react";
import {
  statisticsCardsDataTheacher,
} from "@/data";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function HomeTeacher() {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard/home");
      }else if(role === null){
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);

  useEffect(() => {
    const loadCardsData = async () => {
      const data = await statisticsCardsDataTheacher();
      setCardsData(data);
    };

    loadCardsData();
  }, []);

  return (
    <div className="mt-12 w-full">
      <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
        {cardsData.map(({ color, icon, title, value }, index) => (
          <Card key={index} className="border border-blue-gray-100 shadow-sm h-30"> 
            <CardHeader
              variant="gradient"
              color={color}
              floated={false}
              shadow={false}
              className="absolute grid place-items-center"
            >
              {React.createElement(icon, { className: "w-20 h-20 text-white" })} 
            </CardHeader>
            <CardBody className="p-6 text-right">
              <Typography variant="h5" className="font-normal text-blue-gray-600">
                {title}
              </Typography>
              <Typography variant="h2" color="blue-gray">
                {value}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="mb-12 w-full">
          <Card className="border border-blue-gray-100 shadow-sm h-60">
            <CardBody className="p-6 text-center justify-center place-items-center md:mt-9">
              <Typography variant="h1" className="font-normal text-blue-gray-600">
                Welcome Teacher!
              </Typography>
              <Typography variant="h4" color="blue-gray">
                {sessionStorage.getItem("name")}
              </Typography>
            </CardBody>
          </Card>
      </div>
    </div>
  );
}

export default HomeTeacher;
