import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";

import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, searchUsers, updateVideoPost } from "../../lib/appwrite";

import InfoBox from "@/components/InfoBox";
import { useEffect, useState } from "react";
import CreateTab from "@/components/CreateTab";
import NewsCard from "@/components/NewsCard";
import EventCard from "@/components/EventCard";

import { RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { icons, images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { sendPushNotification } from "@/lib/notification";
import EmptyState from "@/components/EmptyState";

const ProfileDetails = () => {
  const { query } = useLocalSearchParams();

  const searchQuery = Array.isArray(query) ? query[0] : query || "";
  const { user: seniorMan, updateUser, setUpdateUser } = useGlobalContext();
  const {
    data: users,
    refetch: usersRefresh,
    loading: usersLoading,
  } = useAppwrite(() => searchUsers("accountId", searchQuery));

  const [userId, setUserId] = useState(null);

  const [user, setUser] = useState<any>(null);

  // Update postId when posts data changes
  useEffect(() => {
    if (users && users.length > 0) {
      setUserId(users[0]?.$id);
      setUser(users[0]);
    }
  }, [users]);

  useEffect(() => {
    usersRefresh();
  }, [query]);

  const {
    data: posts,
    refetch,
    loading: ploading,
  } = useAppwrite(() => getUserPosts(user?.$id), userId);

  const {
    data: events,
    refetch: erefetch,
    loading: eloading,
  } = useAppwrite(() => getUserPosts(user?.$id, "event"), userId);

  const [activeTab, setActiveTab] = useState("news");

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await erefetch();
    setRefreshing(false);
  };
  const [loadingU, setLoadingU] = useState(false);

  const updateUserInfo = async (query: string) => {
    let updateRole;
    if (user?.role === "user" && query === "admin") {
      updateRole = "admin";
    } else if (user?.role === "user" && query === "verified") {
      updateRole = "verified";
    } else if (user?.role === "admin" && query === "admin") {
      updateRole = "verified";
    } else if (user?.role === "verified" && query === "admin") {
      updateRole = "admin";
    } else if (user?.role === "verified" && query === "verified") {
      updateRole = "user";
    } else if (user?.role === "admin" && query === "verified") {
      updateRole = "user";
    } else if (user?.role === "admin" && query === "suspended") {
      updateRole = "suspended";
    } else if (user?.role === "suspended" && query === "suspended") {
      updateRole = "user";
    } else if (user?.role === "verified" && query === "suspended") {
      updateRole = "suspended";
    } else if (user?.role === "suspended" && query === "verified") {
      updateRole = "verified";
    } else if (user?.role === "suspended" && query === "admin") {
      updateRole = "admin";
    } else if (user?.role === "user" && query === "suspended") {
      updateRole = "suspended";
    }

    const form = {
      collectionId: user?.$collectionId,
      documentId: user?.$id,
      role: updateRole,
    };
    setLoadingU(true);
    try {
      await updateVideoPost(form);
      Alert.alert("Success", `${user?.username} status updated`);

      const message = {
        title: "Newswave",
        body: `Your status has been updated to ${updateRole}`,
      };

      await sendPushNotification([user.expo_Id], message);

      usersRefresh("dontshow");

      user?.$id === seniorMan?.$id && setUpdateUser(!updateUser);
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "An error has occurred, please try again");
    } finally {
      setLoadingU(false);
    }
  };

  if (usersLoading) {
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

  if (!user)
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex justify-center   mt-6 mb-12 px-4 ">
          <View className="justify-between flex-row flex-1  items-center mb-10">
            <TouchableOpacity onPress={() => router.back()} className="">
              <Image
                source={icons.all}
                resizeMode="contain"
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
            <View>
              <Text className="text-gray-200 text-lg font-pmedium capitalize">
                User Profile
              </Text>
              <View className="w-4 self-center   bg-secondary h-[2px]"></View>
            </View>
            <View className=" ">
              <Image
                source={images.logoSmall}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </View>
          <EmptyState
            title="User Profile not found or user account is currently suspended"
            subtitle="User not found"
            event="event"
          />
        </View>
      </SafeAreaView>
    );

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
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center   mt-6 mb-12 px-4 ">
            <View className="justify-between flex-row flex-1  items-center mb-10">
              <TouchableOpacity onPress={() => router.back()} className="">
                <Image
                  source={icons.all}
                  resizeMode="contain"
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>
              <View>
                <Text className="text-gray-200 text-lg font-pmedium capitalize">
                  User Profile
                </Text>
                <View className="w-4 self-center   bg-secondary h-[2px]"></View>
              </View>
              <View className=" ">
                <Image
                  source={images.logoSmall}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>
            </View>
            <View className="items-center">
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
                  <Text className="text-gray-100 font-medium text-xs">
                    Not Verified
                  </Text>
                ) : user?.role === "admin" ? (
                  <MaterialIcons name="verified" size={14} color="#6834ce" />
                ) : user?.role === "suspended" ? (
                  <Text className="text-red-700 font-medium text-xs">
                    Suspended
                  </Text>
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
            </View>

            {seniorMan?.role === "admin" && (
              <View className="my-5">
                <Text className=" py-1 border-b-gray-200 border-b-[1px] text-gray-100 uppercase text-xs font-psemibold">
                  SETTINGS
                </Text>

                <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
                  <View>
                    <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                      Admin
                    </Text>
                  </View>

                  <View>
                    <Switch
                      trackColor={{ false: "#767577", true: "#6834ce" }}
                      thumbColor={
                        user?.role === "admin" ? "#6834ce" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => updateUserInfo("admin")}
                      value={user?.role === "admin"}
                      disabled={loadingU}
                    />
                  </View>
                </View>
                <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
                  <View>
                    <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                      Verify User
                    </Text>
                  </View>

                  <View>
                    <Switch
                      trackColor={{ false: "#767577", true: "#FF9C01" }}
                      thumbColor={
                        user?.role === "verified" || user?.role === "admin"
                          ? "#FF9C01"
                          : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => updateUserInfo("verified")}
                      value={
                        user?.role === "verified" || user?.role === "admin"
                      }
                      disabled={loadingU}
                    />
                  </View>
                </View>

                <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
                  <View>
                    <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                      Suspend User
                    </Text>
                  </View>

                  <View>
                    <Switch
                      trackColor={{ false: "#767577", true: "#ff0101" }}
                      thumbColor={
                        user?.role === "suspended" ? "#ff0101" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => updateUserInfo("suspended")}
                      value={user?.role === "suspended"}
                      disabled={loadingU}
                    />
                  </View>
                </View>
              </View>
            )}

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

export default ProfileDetails;
