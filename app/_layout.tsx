import { GlobalProvider } from "@/context/GlobalProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // const [isSignedIn, setIsSignedIn] = useState(true);

  // const [loading, setLoading] = useState(false);

  // // Function to get user data from AsyncStorage
  // const getData = async () => {
  //   setLoading(loading);
  //   try {
  //     const value = await AsyncStorage.getItem("@IsUserSignedIn");
  //     if (value ) {
  //       setIsSignedIn(true);
  //     } else {
  //       setIsSignedIn(false);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  // // console.log(isSignedIn);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="landingPage" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="news/[query]" />
        <Stack.Screen name="event/[query]" />
        <Stack.Screen name="search/[query]" />
        <Stack.Screen name="profile/[query]" />
        <Stack.Screen name="eventsearch/[query]" />

        <Stack.Screen name="+not-found" />
      </Stack>
    </GlobalProvider>
  );
}
