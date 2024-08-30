"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AnimatedLink from './AnimatedLink';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/src/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const links = [
    { text: "Início", href: "/", hoveredText: "Home" },
    { text: "Homens", href: "/men", hoveredText: "Men" },
    { text: "Mulheres", href: "/women", hoveredText: "Women" },
    { text: "Contato", href: "/contact", hoveredText: "Contact" },
    { text: "Entrar", href: "/auth", hoveredText: "Login", isAuthLink: true }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-gray-800">
          Tendência Modas
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          {links.slice(0, 4).map(link => (
            <AnimatedLink
              key={link.href}
              text={link.text}
              href={link.href}
              hoveredText={link.hoveredText}
            />
          ))}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-600">Olá, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          ) : (
            <AnimatedLink
              text={links[4].text}
              href={links[4].href}
              hoveredText={links[4].hoveredText}
            />
          )}
        </nav>
        <div className="md:hidden flex items-center">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              Sair
            </button>
          ) : (
            <AnimatedLink
              text={links[4].text}
              href={links[4].href}
              hoveredText={links[4].hoveredText}
            />
          )}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-64 h-full shadow-md p-4">
            <button className="mb-4" onClick={() => setMenuOpen(false)}>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <nav className="flex flex-col space-y-4">
              {links.slice(0, 4).map(link => (
                <AnimatedLink
                  key={link.href}
                  text={link.text}
                  href={link.href}
                  hoveredText={link.hoveredText}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
