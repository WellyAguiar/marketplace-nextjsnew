import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welly",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/image.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <div>
          <Navbar />
        </div>
        {children}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 Tendência Modas. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
