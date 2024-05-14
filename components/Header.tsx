"use client";

import React from "react";
import { Logo } from "@/lib/svgs";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed min-w-full px-2 sm:px-4 py-4 flex items-center bg-background shadow z-40">
      <div className="container flex justify-between items-center mx-auto">
        <a href="/" className="flex items-center z-40">
          <Logo />
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 z-40"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "fixed inset-0 z-20" : "hidden"} bg-background md:flex md:items-center md:justify-between md:w-auto md:bg-transparent`}
        >
          <ul className="flex flex-col gap-5 md:flex-row items-center justify-center min-h-screen md:min-h-0  text-foreground">
            <li>
              <Button size="lg" className="md:size-sm md:px-4">
                Get in studio
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
