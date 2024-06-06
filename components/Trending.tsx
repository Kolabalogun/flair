import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { timeAgo } from "@/utils/timeAgo";
import { router } from "expo-router";

const TrendingItem = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      className="relative flex justify-between  mr-5 bg-[#121212]   w-64 py-1 px-1 overflow-hidden rounded-2xl border-2    border-secondary"
      activeOpacity={0.7}
      onPress={() => router.push(`/news/${item.$id}`)}
    >
      <View className=" ">
        <Image
          source={{
            uri: item?.image,
          }}
          className=" w-full h-44 rounded-xl mb-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        />

        <View className="px-1 pb-1">
          <Text
            className="text-white font-psemibold text-base"
            numberOfLines={3}
          >
            {item?.title}
          </Text>
        </View>
      </View>
      <View className="my-2 mx-1 flex-row justify-between items-center">
        <Text className="text-gray-100 uppercase font-psemibold text-xs">
          {item?.author}
        </Text>
        <Text className="text-gray-100 font-pmedium text-xs">
          {timeAgo(item?.$createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Trending = ({ posts }: { posts: any }) => {
  // console.log(posts[0]);

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item, idx) => idx.toLocaleString()}
      renderItem={({ item }) => <TrendingItem item={item} />}
    />
  );
};

export default Trending;
