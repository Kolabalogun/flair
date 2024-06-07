import { getAllUsers, getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the context value
interface GlobalContextType {
  isLoggedIn: boolean | null;
  expoPushToken: string;
  setExpoPushToken: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  setUser: React.Dispatch<any>;
  isLoading: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  allexpoPushToken: string[];

  updateUser: boolean;
  setUpdateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with an undefined default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use the GlobalContext
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Define the props for the GlobalProvider
interface GlobalProviderProps {
  children: ReactNode;
}

// GlobalProvider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [allexpoPushToken, setAllExpoPushToken] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [updateUser, setUpdateUser] = useState<boolean>(true);

  const { data: users, loading } = useAppwrite(getAllUsers);

  useEffect(() => {
    const getExpoIDs = () => {
      if (!loading) {
        const filteredExpoId = users
          .filter((user: any) => user.expo_Id)
          .map((user: any) => user.expo_Id);
        setAllExpoPushToken(filteredExpoId);
      }
    };
    getExpoIDs();
  }, [users]);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [updateUser]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        expoPushToken,
        setExpoPushToken,
        allexpoPushToken,
        updateUser,
        setUpdateUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
