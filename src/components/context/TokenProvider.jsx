import { createContext, useContext, useEffect, useState } from "react";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export default function TokenProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("spotify_access_token") || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (token) {
      localStorage.setItem("spotify_access_token", token);
    }
  }, [token]);
  const logout = () => {
    localStorage.removeItem("spotify_access_token");

    setToken(null);
    window.location.href = "/";
  };

  return (
    <TokenContext.Provider
      value={{ token, setToken, setIsLoggedIn, isLoggedIn, logout }}
    >
      {children}
    </TokenContext.Provider>
  );
}
