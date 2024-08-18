import { Link, useLocation, useNavigate } from "react-router-dom";
import { Slant as Hamburger } from "hamburger-react";
import profile_img from "../assets/profile_img.png";
import React, { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import Modal from "./Modal";
import axios from "axios";

const Navbar = ({ isScrolled = false }) => {
  const [activeLink, setActiveLink] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const title = urlParams.get("title");

  const links = [
    { name: "Home", link: "/home" },
    { name: "TV Shows", link: "/tv-shows" },
    { name: "Movies", link: "/movies" },
    { name: "New & Popular", link: "/popular" },
    { name: "My List", link: "/my-list" },
  ];

  useEffect(() => {
    const matchingLink = links.find((link) => location.pathname === link.link);
    setActiveLink(matchingLink?.name);
    if (title === "") navigate("/home");
  }, [location]);

  const handleSignOut = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACK_END + "/auth/signout",
        {
          withCredentials: true,
        }
      );
      const message = response.data.message;

      if (response.status === 200) {
        toast.success(message || "Sign Out successful!");
        navigate("/login");
      } else {
        toast.error(message || "An error occurred during Sign Out.");
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred during Sign Out."
      );
    }
  };

  const handleSearch = (e) => {
    navigate(`/search?title=${e.target.value}`);
  };

  return (
    <div
      className={`w-full py-5 px-6 flex justify-between fixed text-sm text-gray-300 ${
        isScrolled || openMenu
          ? "bg-black"
          : "bg-gradient-to-b from-black/70 to-transparent"
      } z-[1]`}
    >
      <div className="flex items-center gap-12">
        <img src={logo} alt="logo" className="md:w-24 w-24 lg:w-36" />
        <ul className="hidden md:flex gap-5">
          {links.map(({ name, link }) => {
            return (
              <li
                className={`cursor-pointer hover:underline ${
                  activeLink === name ? "font-extrabold" : ""
                }`}
                key={name}
              >
                <Link to={link}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex gap-5 items-center">
        <div className="flex outline outline-white p-2 gap-2 justify-center items-center">
          <RiSearchLine className="text-xl cursor-pointer text-white" />
          <input
            value={title || ""}
            onChange={handleSearch}
            className="bg-transparent w-28 focus:outline-none"
            placeholder="Search"
            autoFocus
            type="text"
            name="search"
            id="search"
          />
        </div>
        <Profile setOpenModal={setOpenModal} />
        <div className="md:hidden flex">
          <Hamburger toggled={openMenu} toggle={setOpenMenu} />
        </div>
        <Sidebar
          activeLink={activeLink}
          links={links}
          open={openMenu}
          handleSignOut={handleSignOut}
          setOpenModal={setOpenModal}
          setOpenMenu={setOpenMenu}
        />
      </div>
      <Modal
        title="Sign Out"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleSignOut}
      >
        Are you sure ?
      </Modal>
    </div>
  );
};

const Profile = ({ setOpenModal }) => {
  return (
    <div className="cursor-pointer relative group/profile hidden items-center gap-2.5 md:flex">
      <img src={profile_img} alt="profile" className="rounded-sm w-9" />
      <AiFillCaretDown className="text-white" />
      <div className="absolute top-full right-0 w-max bg-[#191919] py-4 px-5 underline rounded z-[1] hidden group-hover/profile:block">
        <p
          onClick={() => setOpenModal(true)}
          className="text-xs cursor-pointer"
        >
          Sign Out
        </p>
      </div>
    </div>
  );
};

const Sidebar = ({ activeLink, links, open, setOpenMenu, setOpenModal }) => {
  return (
    <div
      onClick={() => setOpenMenu(false)}
      className={`w-full inset-y-0 left-0 overflow-y-auto mt-20 md:hidden fixed flex-col flex bg-black/40 md:transform-none transition-transform ${
        open ? "transform-none" : "-translate-x-full"
      }`}
    >
      <div className="bg-black w-fit py-4 px-8 h-full text-white flex flex-col items-center">
        <ul className="flex flex-col gap-5 items-center">
          {links.map(({ name, link }) => {
            return (
              <li
                className={`cursor-pointer hover:underline text-lg ${
                  activeLink === name ? "font-extrabold" : ""
                }`}
                key={name}
              >
                <Link to={link}>{name}</Link>
              </li>
            );
          })}
        </ul>
        <div className="w-full h-0.5 bg-white my-4"></div>
        <div
          onClick={() => {
            setOpenModal(true);
            setOpenMenu(false);
          }}
          className="cursor-pointer hover:underline text-lg"
        >
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default Navbar;
