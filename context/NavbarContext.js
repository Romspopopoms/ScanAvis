// NavbarContext.js
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const NavbarHeightContext = createContext(0);

export const useNavbarHeight = () => useContext(NavbarHeightContext);

export const NavbarHeightProvider = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, navbarRef }}>
      {children}
    </NavbarHeightContext.Provider>
  );
};
