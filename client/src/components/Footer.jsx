import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Footer = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const socialIcons = [
    { icon: <FaInstagram />, href: "https://www.instagram.com/omeruren27/" },
    { icon: <FaXTwitter />, href: "https://x.com/omerruren" },
    { icon: <FaGithub />, href: "https://github.com/omeruren" },
  ];

  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Search",
      href: "/search",
    },
  ];
  return (
    <footer className="bg-white py-8 border-t dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className=" flex flex-wrap justify-center  dark:text-blue-500 gap-x-4 sm:gap-x-6 text-lg text-gray-600">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.href}
              
              _hover={{ color: "blue.400", transform: "scale(1.1)" }}
              transition="all 0.2s"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="mt-6 flex justify-center space-x-6 dark:text-white text-gray-500 text-xl">
          {socialIcons.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon}
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-lg dark:text-blue-500 text-gray-500">
          © 2025 Rens Estate, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
