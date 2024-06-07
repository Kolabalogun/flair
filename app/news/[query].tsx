import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import {
  config,
  createCommentPost,
  deletePost,
  getAllComments,
  searchPosts,
  updateVideoPost,
} from "../../lib/appwrite";

import Header from "@/components/Header";
import { icons, images } from "@/constants";
import { timeAgo } from "@/utils/timeAgo";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

import EmptyState from "@/components/EmptyState";
import CommentCard from "@/components/CommentCard";
import FormField from "@/components/FormField";
import { useGlobalContext } from "@/context/GlobalProvider";
import { sendPushNotification } from "@/lib/notification";

export interface Comment {
  $id: string;
  desc: string;
  creator: Author;
  $createdAt: string;
}

interface Author {
  username: string;
  avatar: string;
}

const NewsDetails = () => {
  const { query } = useLocalSearchParams();
  const { user, allexpoPushToken } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);

  const [commentLoader, setCommentLoader] = useState(false);

  const [comment, setComment] = useState("");

  const searchQuery = Array.isArray(query) ? query[0] : query || "";

  const {
    data: posts,
    refetch,
    loading,
  } = useAppwrite(() => searchPosts(searchQuery));

  const [postId, setPostId] = useState(null);

  const {
    data: comments,
    refetch: commentRefetch,
    loading: loadingComments,
  } = useAppwrite(() => getAllComments(postId), postId);

  // Update postId when posts data changes
  useEffect(() => {
    if (posts && posts.length > 0) {
      setPostId(posts[0].$id);
    }
  }, [posts]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, [query]);

  const submitComment = async () => {
    if (!comment) {
      return Alert.alert("Error", "Comment cannot be empty");
    }

    const updatedForm = {
      comment,
      news_id: posts[0]?.$id,
      author: user?.username,
    };

    setCommentLoader(true);
    try {
      await createCommentPost({
        ...updatedForm,
        creator: user.$id,
      });

      Alert.alert("Success", "Comment uploaded successfully");

      commentRefetch();
    } catch (error: any) {
      Alert.alert("Error", "Unable to upload comment");
      console.log(error);
    } finally {
      setComment("");

      setCommentLoader(false);
    }
  };

  const toggleTrendingSwitch = async () => {
    try {
      const updatedForm = {
        documentId: posts[0]?.$id,
        collectionId: config.newsCollectionId,
        trending: !posts[0]?.trending,
      };

      await updateVideoPost({
        ...updatedForm,
      });
      refetch("dontshow");
    } catch (error) {
      console.log(error);
    }
  };
  const submitLikes = async () => {
    try {
      const userLikes = posts[0]?.likes || [];
      const userId = user?.$id;

      // Check if user ID is in the likes array
      let updateLikes;
      if (userLikes.includes(userId)) {
        // Remove user ID from likes array
        updateLikes = userLikes.filter((id: string) => id !== userId);
      } else {
        // Add user ID to likes array
        updateLikes = [...userLikes, userId];
      }

      const updatedForm = {
        documentId: posts[0]?.$id,
        collectionId: config.newsCollectionId,
        likes: updateLikes,
      };

      await updateVideoPost({
        ...updatedForm,
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDocument = async (form: any, type: string) => {
    try {
      await deletePost({
        collectionId: form.$collectionId,
        documentId: form.$id,
      });
      if (type === "post") {
        Alert.alert("Flair", "Post deleted successfully");
        router.back();
        refetch();
      } else {
        Alert.alert("Flair", "Comment deleted successfully");
        commentRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [pushNLoading, setPushNLoading] = useState(false);

  const sendNotificationToAllUsers = async () => {
    setPushNLoading(true);

    try {
      await sendPushNotification(allexpoPushToken, {
        title: posts[0]?.title,
        body: posts[0].desc,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while sending push notifications"
      );
    } finally {
      setPushNLoading(false);
    }
  };

  if (loading || posts.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 ">
        <View>
          <Header
            title={posts[0]?.type}
            fn={() => router.back()}
            img={icons.all}
            img2={images.logoSmall}
          />
        </View>

        <View className="h-[80vh] items-center justify-center">
          <ActivityIndicator color={"#FF9C01"} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View>
        <Header
          title={posts[0]?.type}
          fn={() => router.back()}
          img={icons.all}
          img2={images.logoSmall}
        />
      </View>

      <ScrollView className="px-4 my-5 mb-24">
        <View>
          <Text className="text-white  font-psemibold text-3xl">
            {posts[0]?.title}
          </Text>
        </View>

        <View className="my-3 mx-1 flex-row gap-x-3 items-center">
          <TouchableOpacity
            onPress={() =>
              router.push(`/profile/${posts[0]?.creator?.accountId}`)
            }
            className="items-center flex-row gap-x-1"
          >
            <Text className="text-gray-100 uppercase font-psemibold text-xs">
              {posts[0]?.author}
            </Text>
            {posts[0]?.creator?.role === "admin" ? (
              <MaterialIcons name="verified" size={14} color="#6834ce" />
            ) : posts[0]?.creator?.role === "verified" ? (
              <MaterialIcons name="verified" size={14} color="#FF9C01" />
            ) : (
              <></>
            )}
          </TouchableOpacity>

          <Text className="text-gray-100 uppercase font-psemibold text-xs">
            :
          </Text>
          <Text className="text-gray-100 font-pmedium text-xs">
            {timeAgo(posts[0]?.$createdAt)}
          </Text>
        </View>

        <View className="my-2">
          <Image
            source={{ uri: posts[0]?.image }}
            className="h-52 w-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="my-4">
          <Text className="text-white font-pregular">{posts[0]?.desc} </Text>
        </View>

        <View className="my-5">
          <Text className=" py-1 border-b-gray-200 border-b-[1px] text-gray-100 uppercase text-xs font-psemibold">
            SETTINGS
          </Text>

          {user?.role === "admin" && (
            <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
              <View>
                <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                  Trending
                </Text>
              </View>

              <View>
                <Switch
                  trackColor={{ false: "#767577", true: "#FF9C01" }}
                  thumbColor={posts[0]?.trending ? "#FF9C01" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleTrendingSwitch}
                  value={posts[0]?.trending}
                />
              </View>
            </View>
          )}

          {(user?.role === "admin" ||
            (user?.role === "verified" &&
              user?.$id === posts[0]?.creator?.$id)) && (
            <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
              <View>
                <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                  Notify Users
                </Text>
              </View>

              <TouchableOpacity onPress={sendNotificationToAllUsers}>
                {pushNLoading ? (
                  <ActivityIndicator color={"#FF9C01"} />
                ) : (
                  <Entypo name="bell" size={24} color="#c8c8c8" />
                )}
              </TouchableOpacity>
            </View>
          )}

          <View className="justify-between py-1 border-b-gray-200 border-b-[1px]  flex-row items-center">
            <View>
              <Text className=" py-4 text-gray-100 flex-col  capitalize text-sm font-pmedium">
                Contact Admin
              </Text>
            </View>

            <TouchableOpacity>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="#FF8E01"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="bg-black-100 border-2 border-black-200 px-2 py-1 flex-row justify-between w-48  my-4 absolute bottom-3 self-center  rounded-full">
        <View className="flex-row items-center gap-1 ">
          <TouchableOpacity
            disabled={loadingComments}
            onPress={() => setModalVisible(true)}
            className="items-center    bg-black-200 p-2 rounded-full   "
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={22}
              color="#C8C8C8"
            />
          </TouchableOpacity>
          <Text className="text-sm font-pmedium text-gray-100">
            {comments?.length}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 ">
          <TouchableOpacity
            onPress={submitLikes}
            className="items-center  bg-black-200 p-2   rounded-full  "
          >
            {posts[0]?.likes?.includes(user?.$id) ? (
              <AntDesign name="heart" size={20} color="red" />
            ) : (
              <AntDesign name="hearto" size={20} color="#C8C8C8" />
            )}
          </TouchableOpacity>
          <Text className="text-sm font-pmedium text-gray-100">
            {posts[0]?.likes?.length || 0}
          </Text>
        </View>

        {posts[0]?.creator?.$id === user?.$id && (
          <TouchableOpacity
            onPress={() => deleteDocument(posts[0], "post")}
            className="items-center  bg-black-200 p-2  rounded-full  "
          >
            <MaterialIcons name="delete" size={22} color="#C8C8C8" />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className=" flex-1 h-full  bg-primary">
          <FlatList
            data={comments}
            keyExtractor={(item) => item.$id.toLocaleString()}
            renderItem={({ item }) => (
              <CommentCard {...item} deleteDoc={deleteDocument} itm={item} />
            )}
            ListHeaderComponent={() => (
              <View>
                <Header
                  title={"Comments"}
                  fn={() => setModalVisible(!modalVisible)}
                  img={icons.al}
                  img2={images.logoSmall}
                />

                <View className="w-full     bg-gray-100 h-[1px] mb-5"></View>
              </View>
            )}
            ListEmptyComponent={() => (
              <EmptyState title="No Comment Found" subtitle="Post a comment" />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          <View className="mb-4 mx-4">
            <FormField
              title="comment"
              value={comment}
              commentLoader={commentLoader}
              commentfn={submitComment}
              placeholder="Enter your comment here..."
              handleChangeText={(e) => setComment(e)}
              otherStyles="mt-10"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NewsDetails;
