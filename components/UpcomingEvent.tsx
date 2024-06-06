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
import { CreateNewsEventFormType } from "@/app/(tabs)/create";
import { formatDate } from "@/utils/formatDate";

const UpcomingEventItem = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      className="relative   justify-between  mr-5 bg-[#121212]   w-48 pb-1   overflow-hidden rounded-2xl border-2    border-[#511bb7]"
      activeOpacity={0.7}
      onPress={() => router.push(`/event/${item.$id}`)}
    >
      <View className=" ">
        <Image
          source={{
            uri: item?.image,
          }}
          className=" w-full h-28 rounded-t-xl mb-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        />

        <View className="flex-row px-2 pb-1 justify-between items-center flex-1">
          <View>
            <View className="">
              <Text
                className="text-white font-psemibold text-base"
                numberOfLines={3}
              >
                {item?.title}
              </Text>
            </View>

            <View className="mt-2    w-full flex-row  justify-between  items-center">
              <Text className="text-gray-100 uppercase font-psemibold text-xs">
                {item?.location}
              </Text>
              <Text className="text-secondary-100 font-psemibold text-xs">
                {formatDate(item?.date)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const UpcomingEvent = ({ events }: { events: CreateNewsEventFormType[] }) => {
  return (
    <FlatList
      data={events}
      horizontal
      keyExtractor={(idx) => idx.toLocaleString()}
      renderItem={({ item }) => <UpcomingEventItem item={item} />}
    />
  );
};

export default UpcomingEvent;
