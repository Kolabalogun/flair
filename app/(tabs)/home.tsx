import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";

import { icons, images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllPosts, updateVideoPost } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getTimeOfDay from "@/utils/timeOfTheDay";
import Topic from "@/components/Topics";
import NewsCard from "@/components/NewsCard";
import { CreateNewsFormType } from "./create";

const topics = [
  {
    id: 1,
    title: "All",
    img: icons.news,
  },
  {
    id: 2,
    title: "Events",
    img: icons.event,
  },
  {
    id: 3,
    title: "Education",
    img: icons.education,
  },
  {
    id: 4,
    title: "Sports",
    img: icons.sports,
  },
  {
    id: 5,
    title: "Others",
    img: icons.others,
  },
];

export default function HomeScreen() {
  const { user, expoPushToken } = useGlobalContext();

  const [activeTab, setActiveTab] = useState(topics[0]);

  const { data: posts, refetch, loading } = useAppwrite(getAllPosts);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    switch (activeTab?.title) {
      case "Events":
        return posts.filter((post: any) => post.type.toLowerCase() === "event");
      case "Education":
        return posts.filter(
          (post: any) => post.type.toLowerCase() === "education"
        );
      case "Sports":
        return posts.filter(
          (post: any) => post.type.toLowerCase() === "sports"
        );
      case "Others":
        return posts.filter(
          (post: any) => post.type.toLowerCase() === "others"
        );
      default:
        return posts;
    }
  }, [posts, activeTab]);

  const trendingpost =
    posts?.filter((post: CreateNewsFormType) => post.trending).length > 0
      ? posts?.filter((post: CreateNewsFormType) => post.trending)
      : posts;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const checkIfUserHasExpoID = async () => {
      const form = {
        collectionId: user?.$collectionId,
        documentId: user?.$id,
        expo_Id: expoPushToken,
      };

      if (user?.expo_Id === null || user?.expo_Id === "") {
        await updateVideoPost(form);

        Alert.alert("User Expo ID has been updated");
      }
    };

    checkIfUserHasExpoID();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 ">
        <View className="flex my-6 px-4 space-y-6">
          <View className="flex justify-between items-start flex-row mb-5">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                {getTimeOfDay()},
              </Text>
              <Text className="text-2xl font-psemibold text-white capitalize">
                {user?.username}
              </Text>
            </View>

            <View className="mt-1.5">
              <Image
                source={images.logoSmall}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
          </View>
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
        data={filteredPosts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <NewsCard item={item} filteredPosts={filteredPosts} />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-5">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  {getTimeOfDay()},
                </Text>
                <Text className="text-2xl font-psemibold text-white capitalize">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            {posts.length > 0 && (
              <View className="w-full flex-1 pt-3 pb-3">
                <Text className="text-lg font-pmedium text-gray-100 mb-3 font-medium">
                  Trending News
                </Text>

                <Trending posts={trendingpost ?? []} />
              </View>
            )}
            <View className="w-full flex-1 pt-0 pb-8">
              <Text className="text-lg font-pmedium text-gray-100 mb-3 font-medium">
                Topics
              </Text>

              <Topic
                topics={topics}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No News Found" subtitle="No news created yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
