import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({
  title,
  subtitle,
  event,
}: {
  title: string;
  subtitle: string;
  event?: string;
}) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      {title !== "No Comment Found" && (
        <CustomButton
          title={`Create an ${event ? "event" : "article"}`}
          handlePress={() => router.push("/create")}
          containerStyles="w-full my-5"
          event={event}
        />
      )}
    </View>
  );
};

export default EmptyState;