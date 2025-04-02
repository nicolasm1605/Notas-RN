import React, { createContext, useContext, useState } from "react";

const TemaContext = createContext();

export const TemaProvider = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);

  const toggleModoOscuro = () => {
    setModoOscuro((prevModo) => !prevModo);
  };

  return (
    <TemaContext.Provider value={{ modoOscuro, toggleModoOscuro }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTema = () => {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema debe usarse dentro de un TemaProvider");
  }
  return context;
};
