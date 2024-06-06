import { icons } from "@/constants";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const TopicItem = ({
  item,
  setActiveTab,
  activeTab,
}: {
  item: any;
  setActiveTab: any;
  activeTab: any;
}) => {
  return (
    <View className="gap-2">
      <TouchableOpacity
        className="relative flex justify-between items-center  mr-3 bg-black-100  w-20 py-2 px-1 overflow-hidden rounded-2xl border-2 border-black-200 focus:border-secondary"
        activeOpacity={0.7}
        onPress={() => setActiveTab(item)}
      >
        <View className=" ">
          <Image
            source={item.img}
            className=" w-16 h-10 rounded-xl mb-2 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="contain"
          />

          <View className="px-1 pb-1">
            <Text
              className="text-gray-200 text-center font-pmedium text-xs"
              numberOfLines={3}
            >
              {item?.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {activeTab.id === item.id && (
        <View className="w-10 self-center mr-3 bg-secondary h-[2.5px]"></View>
      )}
    </View>
  );
};

const Topic = ({ topics, setActiveTab, activeTab }: any) => {
  return (
    <FlatList
      data={topics}
      horizontal
      keyExtractor={(item, idx) => idx.toLocaleString()}
      renderItem={({ item }) => (
        <TopicItem
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    />
  );
};

export default Topic;
