import { View, Text, RefreshControl } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getAllEvents, getAllPosts, getAllUsers } from "@/lib/appwrite";
import { SafeAreaView } from "react-native";
import Header from "@/components/Header";
import { icons, images } from "@/constants";

import UserCard from "@/components/UsersCard";

import { StatusBar } from "react-native";
import { FlatList } from "react-native";
import CustomButton from "@/components/CustomButton";
import { ActivityIndicator } from "react-native";
import EventCard from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";

// Define types for the data returned by the hooks
type EventType = {
  $id: string;
  title: string;
  // Add other relevant event properties
};

type UserType = {
  $id: string;
  username: string;
  // Add other relevant user properties
};

type PostType = {
  $id: string;
  title: string;
  // Add other relevant post properties
};

// Define a union type for the response
type HookResponse<T> = {
  data: T | null;
  refetch: () => void;
  loading: boolean;
};

const AllInfo: React.FC = () => {
  const { query } = useLocalSearchParams();
  const searchQuery = Array.isArray(query) ? query[0] : query || "";

  const [limit, setLimit] = useState(10);

  // Define hooks based on searchQuery
  const eventsData: HookResponse<EventType[]> | {} =
    searchQuery === "events"
      ? useAppwrite(() => getAllEvents(limit), limit)
      : {};
  const usersData: HookResponse<UserType[]> | {} =
    searchQuery === "users" ? useAppwrite(() => getAllUsers(limit), limit) : {};
  const postsData: HookResponse<PostType[]> | {} =
    searchQuery === "posts" ? useAppwrite(() => getAllPosts(limit), limit) : {};

  // Extract data and loading states
  const {
    data: events,
    refetch: refetchEvents,
    loading: loadingEvents,
  } = eventsData as HookResponse<any>;
  const {
    data: users,
    refetch: refetchUsers,
    loading: loadingUsers,
  } = usersData as HookResponse<UserType[]>;
  const {
    data: posts,
    refetch: refetchPosts,
    loading: loadingPosts,
  } = postsData as HookResponse<PostType[]>;

  // Determine which data to display based on searchQuery
  const dataToDisplay =
    searchQuery === "events" ? events : searchQuery === "users" ? users : posts;
  const isLoading =
    searchQuery === "events"
      ? loadingEvents
      : searchQuery === "users"
      ? loadingUsers
      : loadingPosts;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    searchQuery === "events"
      ? await refetchEvents()
      : searchQuery === "users"
      ? await refetchUsers()
      : await refetchPosts();
    setRefreshing(false);
  };

  if (isLoading)
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex justify-center mt-11  mb-6    ">
          <Header
            title={searchQuery}
            fn={() => router.back()}
            img={icons.all}
            img2={images.logoSmall}
          />
          <View className="h-[95vh] items-center justify-center">
            <ActivityIndicator
              color={searchQuery === "posts" ? "#FF9C01" : "#6834ce"}
              size="large"
            />
          </View>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center   mt-6   ">
        <View>
          <Header
            title={searchQuery}
            fn={() => router.back()}
            img={icons.all}
            img2={images.logoSmall}
          />
        </View>
      </View>
      <FlatList
        data={dataToDisplay}
        keyExtractor={(item) => item?.$id?.toString()}
        renderItem={({ item }) =>
          searchQuery === "users" ? (
            <UserCard user={item} />
          ) : searchQuery === "events" ? (
            <EventCard item={item} />
          ) : (
            <NewsCard item={item} />
          )
        }
        ListFooterComponent={() => (
          <View className="mx-4 my-3">
            <CustomButton
              title="Load More"
              handlePress={() => setLimit(limit + 10)}
              isLoading={isLoading}
              event={searchQuery === "events" ? "events" : null}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default AllInfo;
