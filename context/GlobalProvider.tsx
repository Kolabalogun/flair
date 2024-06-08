import { getAllUsers, getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  storeData: (e: string) => void;
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

        // Remove duplicates using a Set and convert back to array
        const uniqueExpoIds: string[] = Array.from(new Set(filteredExpoId));
        setAllExpoPushToken(uniqueExpoIds);
      }
    };
    getExpoIDs();
  }, [users, loading]);

  

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
          storeData(JSON.stringify(user));
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

  const storeData = async (value: string | null) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem("@IsUserSignedInn");
      } else {
        await AsyncStorage.setItem("@IsUserSignedInn", value);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
        storeData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
