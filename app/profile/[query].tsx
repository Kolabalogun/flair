import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import { useState } from "react";
import CreateTab from "@/components/CreateTab";
import NewsCard from "@/components/NewsCard";
import EventCard from "@/components/EventCard";
import { Alert } from "react-native";
import { RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const {
    data: posts,
    refetch,
    loading: ploading,
  } = useAppwrite(() => getUserPosts(user.$id));

  const {
    data: events,
    refetch: erefetch,
    loading: eloading,
  } = useAppwrite(() => getUserPosts(user.$id, "event"));

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("news");

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await erefetch();
    setRefreshing(false);
  };

  const logout = async () => {
    setLoading(true);
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    Alert.alert("Flair", "User logged out successfully");
    router.replace("/login");
  };

  if (ploading || eloading) {
    return (
      <SafeAreaView className="bg-primary flex-1 ">
        <View className="h-[95vh] items-center justify-center">
          <ActivityIndicator
            color={activeTab === "news" ? "#FF9C01" : "#6834ce"}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={activeTab === "news" ? posts : events}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) =>
          activeTab === "news" ? (
            <NewsCard item={item} />
          ) : (
            <EventCard item={item} />
          )
        }
        ListEmptyComponent={() => (
          <EmptyState
            title={`No ${activeTab === "news" ? "News" : "Event"} Found`}
            subtitle={`No ${
              activeTab === "news" ? "news" : "event"
            } found for this profile`}
            event={activeTab !== "news" ? "event" : null}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            {loading ? (
              <View className="flex w-full items-end mb-10">
                <ActivityIndicator
                  color={activeTab === "news" ? "#FF9C01" : "#6834ce"}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={logout}
                className="flex w-full items-end mb-10"
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            )}

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="items-center flex-row">
              <Text className="text-gray-100 text-xs font-psemibold ">
                Status:{" "}
              </Text>

              {user?.role === "user" ? (
                <Text>Not Verified</Text>
              ) : user?.role === "admin" ? (
                <MaterialIcons name="verified" size={14} color="#6834ce" />
              ) : (
                <MaterialIcons name="verified" size={14} color="#FF9C01" />
              )}
            </View>

            <View className="my-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title={events?.length || 0}
                subtitle="Events"
                titleStyles="text-xl"
              />
            </View>

            <View className="w-full     bg-gray-100 h-[1px] mb-5"></View>

            <CreateTab activeTab={activeTab} setActiveTab={setActiveTab} />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
