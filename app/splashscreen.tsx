import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary h-full">
      <ActivityIndicator size={"large"} color={"#FF9C01"} />
    </SafeAreaView>
  );
};

export default SplashScreen;
