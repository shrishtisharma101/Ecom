import { useState } from "react";
import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";
import BottomNavbar from "./BottomNavbar";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <TopBar />

      {/* Main Header */}
      <MainNavbar toggleMenu={toggleMenu} />

      {/* Bottom Navigation */}
      <BottomNavbar />

      {/* Mobile Sidebar */}
      <MobileMenu
        isOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />
    </>
  );
};

export default Navbar;