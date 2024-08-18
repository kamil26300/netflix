import React from "react";
import logo from "../assets/logo.png";

const AuthLayout = ({ children, title }) => {
  return (
    <div
      className={`min-h-screen w-full bg-[url('./assets/background_banner.jpg')] bg-cover`}
    >
      <div className="bg-black/30 min-h-screen w-full pb-12 items-center flex flex-col">
        <div className="flex items-center px-4 py-8 sm:px-16 w-full">
          <div className="logo">
            <img className="h-10" src={logo} alt="logo" />
          </div>
        </div>
        <div className="flex flex-col gap-10 p-10 bg-black/70 rounded mt-12 min-w-96">
          <h3 className="font-[400] text-4xl">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
