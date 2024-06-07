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
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import {
  config,
  createCommentPost,
  deletePost,
  getAllComments,
  searchEvents,
  searchTicket,
  searchTrendingPosts,
  updateVideoPost,
} from "../../lib/appwrite";

import Header from "@/components/Header";
import { icons, images } from "@/constants";

import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useGlobalContext } from "@/context/GlobalProvider";
import { formatDate, formatTime } from "@/utils/formatDate";
import CustomButton from "@/components/CustomButton";
import ModalComponent from "@/components/Modal";
import FormField from "@/components/FormField";

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

const EventDetails = () => {
  const { query } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);

  const [commentLoader, setCommentLoader] = useState(false);

  const [btModalVisible, setBTModalVisible] = useState(false);
  const [tModalVisible, setTModalVisible] = useState(false);

  const [bTLoader, setBTLoader] = useState(false);

  const [comment, setComment] = useState("");

  const [ticketNote, setTicketNote] = useState("");

  const searchQuery = Array.isArray(query) ? query[0] : query || "";

  const {
    data: posts,
    refetch,
    loading,
  } = useAppwrite(() => searchEvents(searchQuery));

  const [postId, setPostId] = useState(null);

  const {
    data: comments,
    refetch: commentRefetch,
    loading: loadingComments,
  } = useAppwrite(() => getAllComments(postId, true), postId);

  const {
    data: allTrendingPosts,
    loading: allTrendingPostLoading,
    refetch: allTrendingPostRefetch,
  } = useAppwrite(() => searchTrendingPosts());

  const {
    data: allTickets,
    loading: allTicketLoading,
    refetch: allTicketRefetch,
  } = useAppwrite(() => searchTicket(postId), postId);

  const {
    data: tickets,
    loading: ticketLoading,
    refetch: ticketRefetch,
  } = useAppwrite(() => searchTicket(postId, user?.$id), postId);

  // Update postId when posts data changes
  useEffect(() => {
    if (posts && posts.length > 0) {
      setPostId(posts[0]?.$id);
    }
  }, [posts]);

  useEffect(() => {
    refetch();
  }, [query]);

  const findTicketIDForCurrentUser = tickets?.filter(
    (ticket: any) => ticket?.creator?.$id === user?.$id
  );

  const toggleTrendingSwitch = async () => {
    if (allTrendingPosts.length >= 1 && !posts[0]?.trending) {
      return Alert.alert(
        "Error",
        "You can't set more than one Event as Trending Event"
      );
    }

    try {
      const updatedForm = {
        documentId: posts[0]?.$id,
        collectionId: config.eventsCollectionId,
        trending: !posts[0]?.trending,
      };

      await updateVideoPost({
        ...updatedForm,
      });
      refetch("dontshow");
      !posts[0]?.trending &&
        Alert.alert("Success", "Event successfully set as Trending");

      allTrendingPostRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async () => {
    if (!comment) {
      return Alert.alert("Error", "Comment cannot be empty");
    }

    const updatedForm = {
      comment,
      event_id: posts[0]?.$id,
      author: user?.username,
    };

    setCommentLoader(true);
    try {
      await createCommentPost(
        {
          ...updatedForm,
          creator: user.$id,
        },
        "event"
      );

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

  const submitTicket = async () => {
    const updatedForm = {
      desc: ticketNote,
      postId: posts[0]?.$id,
      userId: user?.$id,
    };

    setBTLoader(true);
    try {
      await createCommentPost(
        {
          ...updatedForm,
          creator: user.$id,
        },
        "ticket"
      );

      allTicketRefetch();
      ticketRefetch();
      Alert.alert("Success", "Ticket Booked successfully");

      setBTModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", "Unable to upload comment");
      console.log(error);
    } finally {
      setComment("");

      setBTLoader(false);
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

        likes: updateLikes,
        collectionId: config.eventsCollectionId,
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
        Alert.alert("Flair", "Event deleted successfully");
        router.replace("/home");
        refetch();
      } else {
        Alert.alert("Flair", "Document deleted successfully");
        commentRefetch();
        allTicketRefetch();
        ticketRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || posts.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 ">
        <View>
          <Header
            title={"Event"}
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
          title={"Event"}
          fn={() => router.back()}
          img={icons.all}
          img2={images.logoSmall}
        />
      </View>

      <ScrollView className="px-4 my-5 mb-24  ">
        <View>
          <Text className="text-white mb-1 font-psemibold text-3xl">
            {posts[0]?.title}
          </Text>
        </View>

        <View className=" mb-2 mx-1 flex-row gap-x-3 items-center">
          <View className="items-center flex-row gap-x-1">
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
          </View>
          <Text className="text-gray-100 uppercase font-psemibold text-xs">
            :
          </Text>
          <Text className="text-secondary font-pmedium text-xs">
            {posts[0]?.location}
          </Text>
        </View>

        <View className="my-2">
          <Image
            source={{ uri: posts[0]?.image }}
            className="h-52 w-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="my-3  mx-1 flex-row gap-x-3 items-center">
          <Text className="text-secondary font-pmedium text-xs">
            {formatDate(posts[0]?.date)}
          </Text>
          <Text className="text-gray-100 uppercase font-psemibold text-xs">
            :
          </Text>
          <Text className="text-gray-100 font-pmedium text-xs">
            {formatTime(posts[0]?.timee)}
          </Text>
        </View>
        <View className="mb-3  mx-1 flex-row gap-x-3 items-center">
          <Text className=" text-gray-100 uppercase font-pmedium text-xs">
            {"Reservations"}
          </Text>
          <Text className="  text-gray-100 uppercase font-psemibold text-xs">
            :
          </Text>
          <Text className="text-secondary font-pmedium text-xs">
            {allTickets?.length || 0}
          </Text>
        </View>
        {posts[0]?.entryFee !== "0" && (
          <View className="mt-0 mb-1 mx-1 flex-row gap-x-3 items-center">
            <Text className="text-gray-100 uppercase font-psemibold text-xs">
              Entry Fee
            </Text>
            <Text className="text-gray-100 uppercase font-psemibold text-xs">
              :
            </Text>
            <Text className="text-secondary font-pmedium text-xs">
              N{posts[0]?.entryFee} / Person
            </Text>
          </View>
        )}

        <ScrollView horizontal className="flex-row my-3 space-x-3">
          {posts[0]?.options?.map((opt: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              className="items-center  justify-center   p-2 bg-[#373c3f]   rounded-sm"
            >
              <Text className="text-white text-center  ">{opt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="my-4 ">
          <Text className="text-white font-pregular">{posts[0]?.desc} </Text>
        </View>

        <View className="mb-5">
          {ticketLoading ? (
            <ActivityIndicator color={"#6834ce"} />
          ) : tickets?.length > 0 ? (
            <View className="p-5 border-2 border-black-100 bg-black-200 rounded-lg">
              <View className="mb-2 flex-row gap-x-1 items-center">
                <Text className="text-gray-200 font-pmedium">
                  You've successfully registered for this Event
                </Text>

                <AntDesign name="checkcircleo" size={13} color="#fff" />
              </View>

              <Image
                source={images.qrcode}
                className="h-32 w-full rounded-lg  mb-2 "
                resizeMode="cover"
              />

              <Text className="text-gray-200 font-pmedium">
                Ticket ID:{" "}
                {findTicketIDForCurrentUser?.length > 0 &&
                  findTicketIDForCurrentUser[0]?.creator?.$id}
              </Text>
            </View>
          ) : (
            <CustomButton
              title="Book Ticket"
              handlePress={() => setBTModalVisible(!btModalVisible)}
              containerStyles="mt-7"
              isLoading={bTLoader}
              event="event"
            />
          )}
        </View>

        <View className=" ">
          {allTicketLoading || allTickets?.length === 0 ? (
            <Text></Text>
          ) : (
            <>
              {user?.$id === (posts?.[0] && posts[0].creator?.$id) && (
                <CustomButton
                  title="View Reservations"
                  handlePress={() => setTModalVisible(!tModalVisible)}
                  containerStyles="mt-7"
                  isLoading={bTLoader}
                />
              )}
            </>
          )}
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
                  disabled={allTrendingPostLoading}
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

              <TouchableOpacity>
                <Entypo name="bell" size={24} color="#c8c8c8" />
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
      {/* Comment */}
      <ModalComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        comment={comment}
        type
        // bookticket={false}
        comments={comments}
        deleteDocument={deleteDocument}
        commentLoader={commentLoader}
        submitComment={submitComment}
        setComment={setComment}
      />

      {/* Book Ticket  */}
      <ModalComponent
        modalVisible={btModalVisible}
        setModalVisible={setBTModalVisible}
        comment={comment}
        type
        bookticket="bookticket"
        comments={comments}
        deleteDocument={deleteDocument}
        commentLoader={commentLoader}
        submitComment={submitComment}
        setComment={setComment}
      >
        <ScrollView className=" flex-1 h-full  bg-primary">
          <View className="justify-between flex-1 h-full">
            <View>
              <Header
                title={"Book Ticket"}
                fn={() => setModalVisible(!modalVisible)}
                img={icons.al}
                img2={images.logoSmall}
              />

              <View className="w-full     bg-gray-100 h-[1px] mb-0"></View>
            </View>

            <Text className="text-xs text-gray-100  p-4 font-pregular">
              {
                "(Please note, if it's a paid event, online payment through the Flair App is currently unavailable. Booking a ticket here will guarantee you a seat at the event, but you will need to pay the entry fee upon arrival.)"
              }
            </Text>

            <View className="flex-1">
              <View className="mb-4 mx-4">
                <FormField
                  readOnly
                  title="Username"
                  value={user?.username}
                  placeholder="Enter your username here..."
                  handleChangeText={(e) => console.log(e)}
                  otherStyles="mt-10"
                />
              </View>
              <View className="mb-4 mx-4">
                <FormField
                  readOnly
                  title="Email"
                  value={user?.email}
                  placeholder="Enter your email here..."
                  handleChangeText={(e) => console.log(e)}
                  otherStyles="mt-10"
                />
              </View>
              <View className={`space-y-2 mt-7 mx-4`}>
                <Text className="text-base text-gray-100 font-pmedium">
                  Note
                </Text>

                <View className="w-full h-32 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#511bb7] flex flex-row items-center">
                  <TextInput
                    className="flex-1 text-white h-full py-5 font-psemibold text-base"
                    value={ticketNote}
                    placeholder="(optional)..."
                    placeholderTextColor="#7B7B8B"
                    onChangeText={(e) => setTicketNote(e)}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>
            <View className=" mt-8 mb-5 px-4">
              <CustomButton
                title="Register"
                handlePress={submitTicket}
                containerStyles="mt-7"
                isLoading={bTLoader}
                event="event"
              />
            </View>
          </View>
        </ScrollView>
      </ModalComponent>

      {/* Reservations */}
      <ModalComponent
        modalVisible={tModalVisible}
        setModalVisible={setTModalVisible}
        comment={comment}
        type
        bookticket="seats"
        comments={allTickets}
        deleteDocument={deleteDocument}
        commentLoader={commentLoader}
        submitComment={() => console.log("ticket")}
        setComment={setComment}
      />
    </SafeAreaView>
  );
};

export default EventDetails;
