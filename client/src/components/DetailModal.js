import React, { useEffect, useState } from "react";
import Loader from "../assets/netflix_spinner.gif";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import { FaCross, FaCrosshairs, FaPlay, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { ImCross } from "react-icons/im";

function DetailModal({ isOpen, setOpen }) {
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const onClose = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("type");
    searchParams.delete("id");

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
    setData(null);
    setOpen(false);
  };

  function convertYoutubeUrlToEmbed(url) {
    const match = url.match(/v=([^&]+)/);
    return `https://www.youtube.com/embed/${match[1]}?rel=0&&controls=0&disablekb=1&loop=1&playsinline=1&autoplay=1`;
  }

  useEffect(() => {
    const fetchData = async (apiItemType, apiItemId) => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_END +
            `/${apiItemType}/detail/${apiItemId}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setData(response?.data);
        } else {
          toast.error(response?.data?.message);
          setOpen(false);
        }
      } catch (error) {
        toast.error(error?.message || "Server error");
        setOpen(false);
      }
    };

    const urlParams = new URLSearchParams(location.search);
    const apiItemType = urlParams.get("type");
    const apiItemId = urlParams.get("id");
    if (apiItemId && apiItemType) {
      fetchData(apiItemType, apiItemId);
      setOpen(true);
    }
  }, [setOpen, location.search]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("[&::-webkit-scrollbar]:hidden");
    } else {
      document.body.classList.remove("[&::-webkit-scrollbar]:hidden");
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-scroll py-6">
      <div className="inset-0 bg-black/50 fixed" onClick={onClose}></div>

      <div className="z-10 w-[80%] md:w-[70%] lg:w-[60%] relative bg-[#191919] rounded-2xl min-h-96 h-max my-auto flex justify-center items-center flex-col">
        {data ? (
          <>
            <div className="relative w-full pt-[56.25%]">
              <div className="absolute top-0 left-0 w-full h-full">
                <iframe
                  title={data.video[0].title}
                  src={convertYoutubeUrlToEmbed(data.video[0].url)}
                  className="w-full h-full tr-video rounded-2xl"
                ></iframe>
                <button onClick={() => setOpen(false)} className="absolute p-3.5 bg-black outline text-xl rounded-full top-4 right-5">
                  <ImCross />
                </button>
                <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => navigate("/player/" + data.id)}
                    className="bg-zinc-400 flex items-center py-2 px-6 gap-1.5 font-extrabold text-[#191919]"
                  >
                    <FaPlay /> Play
                  </button>
                  <button className="flex outline p-2 text-white rounded-full">
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
            <div className="pb-8 px-8 pt-1 flex flex-col gap-6 text-[0.9rem] leading-relaxed">
              {/* Row-1 */}
              <div className="flex gap-3 text-center">
                <div className=" text-zinc-400 my-auto">
                  {(data.releaseDate || data.firstAirDate)?.slice(0, 4)}
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg mr-1">
                    <AiFillStar />
                  </span>
                  <span className="font-semibold mr-1">
                    {Math.round(data.voteAverage * 10) / 10}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    ({data.voteCount})
                  </span>
                </div>
                <div className="border-2 border-zinc-400 text-zinc-400 p-1 text-sm leading-none my-auto h-min">
                  {data.originalLanguage}
                </div>
                {data.adult && (
                  <div className="relative rounded-full border-2 font-semibold border-white bg-red-500 p-1">
                    18+
                  </div>
                )}
              </div>
              <p>{data.overview || ""}</p>
              <p>
                <span className="text-zinc-400">Genres: </span>
                {data.genres.map((genre) => genre)?.join(", ")}
              </p>
              <p>
                <span className="text-zinc-400">Videos: </span>
                {data.video.map((vid, index) => (
                  <>
                    <a
                      className="hover:underline"
                      href={vid.url}
                      key={index}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vid.name}
                    </a>

                    {index !== data.video.length - 1 && ", "}
                  </>
                ))}
              </p>
              {data.cast && (
                <p>
                  <span className="text-zinc-400">Cast: </span>
                  {data.cast.map((cast) => cast.name)?.join(", ")}
                </p>
              )}
            </div>
          </>
        ) : (
          <img
            className="h-10 w-10 rounded-full mx-auto"
            src={Loader}
            alt="loader"
          />
        )}
      </div>
    </div>
  ) : null;
}

export default DetailModal;
