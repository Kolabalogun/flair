import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        Alert.alert("Project ID not found");
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("Expo push token:", token);
    } catch (e) {
      console.error("Error fetching push token:", e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const Home = () => {
  const { isLoggedIn, isLoading, setExpoPushToken, expoPushToken, setUser } =
    useGlobalContext();

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? "")
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const [isSignedIn, setIsSignedIn] = useState<any>(true);

  const [loading, setLoading] = useState<any>(true);

  // Function to get user data from AsyncStorage
  const getData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem("@IsUserSignedInn");

      if (value) {
        setIsSignedIn(true);
        setUser(JSON.parse(value as string));
      } else {
        setIsSignedIn(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!isLoading && isLoggedIn && isSignedIn)
    return <Redirect href={"/home"} />;

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className={"w-full justify-center items-center h-full px-4 "}>
          <Image
            source={images.logoSmall}
            className="w-[50px] h-[50px] "
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Explore Boundless{"\n"}
              Horizons with <Text className="text-secondary-200">Flair</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Discover News & Events: A Journey of Endless Exploration with Flair!
          </Text>

          <CustomButton
            isLoading={isSignedIn || loading}
            title="Continue with Email"
            handlePress={() => router.push("/login")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
