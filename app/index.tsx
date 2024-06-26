import { View, Text, Platform, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native";

import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "./landingPage";
import useAppwrite from "@/lib/useAppwrite";
import { getAppStatus } from "@/lib/appwrite";

const Home = () => {
  const { setExpoPushToken, setUser } = useGlobalContext();

  const [loading, setLoading] = useState<boolean>(true);

  const [tokenFromAsStorage, setTokenFromAsStorage] = useState<string | null>(
    null
  );

  const storeData = async (value: string) => {
    try {
      setExpoPushToken(value);
      await AsyncStorage.setItem("@expoID", value);
    } catch (e) {
      console.log(e);
    }
  };

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const [isSignedIn, setIsSignedIn] = useState<any>(null);

  const initializeNotifications = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      storeData(token);
      setExpoPushToken(token);
    } else {
      Alert.alert("Network", "Network Error, Please reload the Application");
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem("@IsUserSignedInn");
      const token = await AsyncStorage.getItem("@expoID");

      if (token) {
        setExpoPushToken(token);
        setTokenFromAsStorage(token);
      } else {
        setTokenFromAsStorage(null);
        initializeNotifications();
      }

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
    if (!tokenFromAsStorage) {
      initializeNotifications();
    }

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
  }, [tokenFromAsStorage]);

  const [appStatus, setAppStatus] = useState(null);

  const getAppStatuss = async () => {
    try {
      const res = await getAppStatus();

      if (res && res.length > 0) {
        setAppStatus(res[0]?.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppStatuss();

    if (appStatus !== null) {
      getData();
    }
  }, [appStatus]);

  if (loading || !appStatus)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary h-full">
        <ActivityIndicator size={"large"} color={"#FF9C01"} />
      </SafeAreaView>
    );

  if (isSignedIn) return <Redirect href={"/home"} />;

  if (!isSignedIn) return <Redirect href={"/landingPage"} />;

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary h-full">
      <ActivityIndicator size={"large"} color={"#FF9C01"} />
    </SafeAreaView>
  );
};

export default Home;
