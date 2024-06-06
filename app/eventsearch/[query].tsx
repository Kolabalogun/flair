import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchEvents, searchPosts } from "../../lib/appwrite";

import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import NewsCard from "@/components/NewsCard";

const Eventsearch = () => {
  const { query } = useLocalSearchParams();

  const searchQuery = Array.isArray(query) ? query[0] : query || "";

  const {
    data: posts,
    refetch,
    loading,
  } = useAppwrite(() => searchEvents(searchQuery));

  useEffect(() => {
    refetch();
  }, [query]);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 ">
        <View className="flex my-6 px-4">
          <Text className="font-pmedium text-gray-100 text-sm">
            Search Results
          </Text>
          <Text className="text-2xl font-psemibold text-white mt-1">
            {query}
          </Text>
        </View>

        <View className="h-[65vh] items-center justify-center">
          <ActivityIndicator color={"#FF9C01"} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <NewsCard item={item} />}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={searchQuery} type="event" />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Event Found"
            subtitle="No event found for this search"
            event="event"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Eventsearch;
