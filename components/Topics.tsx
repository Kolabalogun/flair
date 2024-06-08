import { icons } from "@/constants";
import { useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TopicItem = ({
  item,
  setActiveTab,
  activeTab,
  topics,
  linePosition,
}: {
  item: any;
  setActiveTab: any;
  activeTab: any;
  topics: any;
  linePosition: any;
}) => {
  const itemWidth = 120; // Replace with your actual item width
  const targetPosition =
    itemWidth * topics.findIndex((t: any) => t.id === item.id);

  const onPress = () => {
    setActiveTab(item);
    // Animate line position
    Animated.timing(linePosition, {
      toValue: targetPosition,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="gap-2">
      <TouchableOpacity
        className="relative flex justify-between items-center  mr-3 bg-black-100    min-w-[120px] py-2 px-1 overflow-hidden rounded-2xl border-2 border-black-200 focus:border-secondary"
        activeOpacity={0.7}
        onPress={() => {
          onPress();
        }}
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
              numberOfLines={1}
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
  const [linePosition, setLinePosition] = useState(new Animated.Value(0));

  const lineStyle = {
    transform: [{ translateX: linePosition }],
  };

  const [contentWidth, setContentWidth] = useState(0);

  const getItemLayout = (_data: any, index: any) => {
    const itemWidth = 120; // Replace with your actual item width
    return { length: itemWidth, offset: itemWidth * index, index };
  };
  return (
    <FlatList
      data={topics}
      horizontal
      keyExtractor={(item, idx) => idx.toLocaleString()}
      showsHorizontalScrollIndicator={false}
      getItemLayout={getItemLayout}
      onContentSizeChange={(width) => setContentWidth(width)}
      initialScrollIndex={topics.findIndex((t: any) => t.id === activeTab.id)} // Set initial scroll position
      renderItem={({ item }) => (
        <TopicItem
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          topics={topics}
          linePosition={linePosition}
        />
      )}
    >
      <Animated.View style={lineStyle}>
        <View className="w-10 self-center mr-3 bg-secondary h-[2.5px]"></View>
      </Animated.View>
    </FlatList>
  );
};

export default Topic;
