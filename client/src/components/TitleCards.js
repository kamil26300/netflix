import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, Loader } from "./CardComp";

const TitleCards = ({ title, type, handleCardClick }) => {
  const [data, setData] = useState(null);

  const getCategory = (title) => {
    return title.replace(/\s/g, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_END +
            `/${type}/get-category/${getCategory(title)}?page=1&limit=20`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setData(response?.data);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(error?.message || "Server error");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <p className="text-2xl mb-2">
        {title} - {type}s
      </p>
      <div className="flex gap-1 [&::-webkit-scrollbar]:hidden overflow-x-scroll h-48 md:h-56 lg:h-72 w-full">
        {data ? (
          data.map((item, index) => {
            return (
              <Card
                item={item}
                key={index}
                handleCardClick={handleCardClick}
                type={type}
              />
            );
          })
        ) : (
          <>
            <Loader visibility="hidden xl:flex" length={7} />
            <Loader visibility="hidden md:flex xl:hidden" length={5} />
            <Loader visibility="flex md:hidden" length={3} />
          </>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
