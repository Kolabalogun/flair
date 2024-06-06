import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllEvents } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useState } from "react";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

import UpcomingEvent from "@/components/UpcomingEvent";
import EventCard from "@/components/EventCard";
import { formatDate } from "@/utils/formatDate";
import { icons } from "@/constants";

export default function Event() {
  const { user } = useGlobalContext();

  const { data: events, refetch } = useAppwrite(getAllEvents);

  const eventss =
    events.length > 0
      ? [events[0], ...events.slice(5, events.length), ...events.slice(1, 4)]
      : [];
  console.log(events);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={eventss}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => <EventCard item={item} />}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold pb-1 text-white capitalize">
                  Hello {user?.username} 👋
                </Text>
                <Text className="font-pmedium text-sm text-gray-100">
                  Let's find a good event
                </Text>
              </View>

              <View className="w-10 h-10 border border-[#6834ce] rounded-lg flex justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
            </View>

            <SearchInput type="event" />

            {eventss.length > 0 && (
              <View className="w-full flex-1 pt-5 pb-8">
                <TouchableOpacity
                  className="relative flex justify-between  mr-5 bg-[#121212]   w-full pb-1   overflow-hidden rounded-2xl border-2    border-[#511bb7]"
                  activeOpacity={0.7}
                  onPress={() => router.push(`/event/${events[0]?.$id}`)}
                >
                  <View className=" ">
                    <Image
                      source={{
                        uri: events[0]?.image,
                      }}
                      className=" w-full h-40 rounded-t-xl mb-5 overflow-hidden shadow-lg shadow-black/40"
                      resizeMode="cover"
                    />
                    <View className="flex-row px-2 pb-1 justify-between items-center flex-1">
                      <View>
                        <View className="">
                          <Text
                            className="text-white font-psemibold text-base"
                            numberOfLines={3}
                          >
                            {events[0]?.title}
                          </Text>
                        </View>

                        <View className="my-2   flex-row space-x-3  items-center">
                          <Text className="text-gray-100 uppercase font-psemibold text-xs">
                            {events[0]?.location}
                          </Text>
                          <Text className="text-gray-100 uppercase font-psemibold text-xs">
                            :
                          </Text>
                          <Text className="text-secondary-100 font-psemibold text-xs">
                            {formatDate(events[0]?.date)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Image
                          source={icons.ar}
                          className="h-6 w-6 mr-2"
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {events.length > 0 && (
              <View className="w-full flex-1 pt-0 pb-8">
                <Text className="text-lg font-pmedium text-gray-100  font-medium mb-3">
                  Upcoming Event
                </Text>

                <UpcomingEvent events={events.slice(1, 5) ?? []} />
              </View>
            )}

            {events.slice(1, 5).length > 0 && (
              <View className="w-full flex-1 pt-0 pb-8">
                <Text className="text-lg font-pmedium text-gray-100  font-medium">
                  Others
                </Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Event Found"
            subtitle="No event created yet"
            event={"event"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
