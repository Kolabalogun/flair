import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { timeAgo } from "@/utils/timeAgo";
import { router } from "expo-router";

const NewsCard = ({ item }: any) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => router.push(`/news/${item.$id}`)}
        className="flex flex-row   justify-between px-4 gap-4  "
      >
        <View>
          <Image
            source={{
              uri: item?.image,
            }}
            className=" w-16 h-16 rounded-md mb-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 justify-between">
          <Text className="text-white font-pmedium ">{item?.title}</Text>

          <View className="my-2   flex-row justify-between items-center">
            <Text className="text-gray-100 uppercase font-psemibold text-xs">
              {item?.author}
            </Text>
            <Text className="text-gray-100 font-pmedium text-xs">
              {timeAgo(item?.$createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View className="h-[0.5px]   bg-gray-100 mx-5 my-6 "></View>
    </View>
  );
};

export default NewsCard;
