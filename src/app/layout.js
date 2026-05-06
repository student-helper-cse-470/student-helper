import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Student Helper",
  description: "Campus-focused academic platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {/* The children prop represents whichever page is currently active */}
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}