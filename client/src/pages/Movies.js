import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TitleCards from "../components/TitleCards";
import { RiPlayFill } from "react-icons/ri";
import video from "../assets/Movie2.mp4";
import { useLocation, useNavigate } from "react-router-dom";
import DetailModal from "../components/DetailModal";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Movies = ({ userId }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);

  const isMdOrLarger = windowWidth >= 768;
  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = (type, itemId) => {
    navigate(`${location.pathname}?type=${type}&id=${itemId}`);
    setMuted(true);
    setOpen(true);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset > 50 ? true : false);
    return () => (window.onscroll = null);
  };

  return (
    <div className="relative">
      <Navbar isScrolled={isScrolled} />
      {isMdOrLarger && (
        <div className="relative">
          <div className="relative w-full pt-[56.25%]">
            <div className="absolute top-0 left-0 w-full h-full">
              <video
                width="100%"
                height="100%"
                className="tr-video"
                src={video}
                autoPlay
                loop
                muted={muted}
              ></video>
            </div>
          </div>
        </div>
      )}
      <div className="pl-6 flex flex-col gap-12 pt-24 md:pt-0 translate-y-0 md:-translate-y-[25%]">
        {isMdOrLarger && (
          <div className="w-full pl-6 flex-col gap-3 flex">
            <p className="text-[4.5rem] font-semibold tracking-wider font-sans">
            GoodFellas
            </p>
            <div className="flex gap-4 items-center">
              <button className="border-none outline-none py-2 px-5 inline-flex items-center gap-2.5 text-sm font-bold bg-white rounded cursor-pointer text-black hover:bg-opacity-80">
                <RiPlayFill className="text-2xl" />
                Play
              </button>
              <button
                className="border rounded-full h-min p-2 border-white"
                onClick={() => setMuted((prev) => !prev)}
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>
        )}
        <TitleCards
          title="Top Rated"
          type="Movie"
          handleCardClick={handleCardClick}
        />
        <TitleCards
          title="Popular"
          type="Movie"
          handleCardClick={handleCardClick}
        />
        <TitleCards
          title="Up Coming"
          type="Movie"
          handleCardClick={handleCardClick}
        />
        <TitleCards
          title="Discover"
          type="Movie"
          handleCardClick={handleCardClick}
        />
      </div>
      <DetailModal setOpen={setOpen} isOpen={open} />
      <div className="md:absolute md:mt-0 mt-6 relative h-96 w-full bottom-0 flex items-center justify-center border-t border-white/20">
        footer
      </div>
    </div>
  );
};

export default Movies;
