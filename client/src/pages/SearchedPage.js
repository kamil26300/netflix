import { useLocation, useNavigate } from "react-router-dom";
import { Card, Loader } from "../components/CardComp";
import DetailModal from "../components/DetailModal";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";

const SearchedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const title = urlParams.get("title");
  const [data, setData] = useState();

  const handleCardClick = (type, itemId) => {
    navigate(`${location.pathname}?title=${title}&type=${type}&id=${itemId}`);
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setData(null);
      setIsLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_END + `/movie&serie/search?title=${title}`,
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
        if (error?.response?.status === 404) setData(null);
        else toast.error(error?.message || "Server error");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [title]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset > 50 ? true : false);
    return () => (window.onscroll = null);
  };

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <div className={`p-3 ${data || isLoading ? "pt-20" : ""}`}>
        {isLoading ? (
          <div className="flex gap-1 h-60 md:h-56 lg:h-72 w-full">
            <Loader visibility="hidden xl:flex" length={7} />
            <Loader visibility="hidden md:flex xl:hidden" length={5} />
            <Loader visibility="flex md:hidden" length={2} />
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 auto-rows-[15rem] md:auto-rows-[14rem] lg:auto-rows-[18rem] gap-3">
            {data?.map((item, id) => (
              <Card
                key={id}
                item={item}
                handleCardClick={handleCardClick}
                type={item.type}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <h1>No Data</h1>
          </div>
        )}
      </div>
      <DetailModal setOpen={setOpen} isOpen={open} />
    </div>
  );
};

export default SearchedPage;
