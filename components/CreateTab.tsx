import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CreateTab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (e: string) => void;
}) => {
  return (
    <View className="flex flex-row items-center justify-between space-x-4 w-full  mb-5 pt-3 pb-1 px-4 bg-black-100 rounded-lg border-2 border-black-200 focus:border-secondary">
      <TouchableOpacity
        onPress={() => setActiveTab("news")}
        className="gap-2 items-center flex-1"
      >
        <View>
          <Text
            className={`font-psemibold ${
              activeTab === "news" ? "text-white" : "text-gray-100"
            } text-base`}
          >
            News
          </Text>
        </View>

        <View
          className={`w-full self-center ${
            activeTab === "news" ? "bg-secondary" : "bg-gray-100"
          } h-[2.5px]`}
        ></View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab("event")}
        className="gap-2 items-center flex-1"
      >
        <View>
          <Text
            className={`font-psemibold ${
              activeTab === "event" ? "text-white" : "text-gray-100"
            } text-base`}
          >
            Event
          </Text>
        </View>

        <View
          className={`w-full self-center ${
            activeTab === "event" ? "bg-[#511bb7]" : "bg-gray-100"
          } h-[2.5px]`}
        ></View>
      </TouchableOpacity>
    </View>
  );
};

export default CreateTab;
