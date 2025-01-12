import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "./api";

interface UserContextProps {
  userData: any;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      apiClient
        .get("/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("User data:", response.data);
          setUserData(response.data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
