// NavbarContext.js
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const NavbarHeightContext = createContext(0);

export const useNavbarHeight = () => useContext(NavbarHeightContext);

export const NavbarHeightProvider = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    // La fonction de mise à jour de la hauteur
    const updateNavbarHeight = () => {
      const currentHeight = navbarRef.current ? navbarRef.current.offsetHeight : 0;
      setNavbarHeight(currentHeight);
      console.log(`Navbar height updated to: ${currentHeight}`);
    };

    // Mettre à jour la hauteur au montage
    updateNavbarHeight();

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      updateNavbarHeight();
    };

    // Ajouter l'écouteur d'événement sur resize
    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur d'événement sur le démontage
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Le tableau de dépendances vide indique que l'effet s'exécute au montage et au démontage

  // Fournir la hauteur et la référence de la navbar à travers le contexte
  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, navbarRef }}>
      {children}
    </NavbarHeightContext.Provider>
  );
};
