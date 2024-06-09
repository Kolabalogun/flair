import { View, Text, TouchableOpacity, Image } from "react-native";

import { timeAgo } from "@/utils/timeAgo";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const UserCard = ({ user }: any) => {
  console.log(user);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/profile/${user?.accountId}`)}
    >
      <View className="flex flex-col   px-4 mt-0  ">
        <View className="flex flex-row gap-1 items-start  ">
          <View
            className={`w-[46px] h-[46px] rounded-lg border   border-secondary  flex justify-center items-center p-0.5`}
          >
            <Image
              source={{ uri: user?.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1   ">
            <View className="flex mt-1 justify-center items-center flex-row flex-1">
              <View className="flex justify-center flex-1 ml-3 gap-y-1">
                <View className="items-center flex-row gap-x-1">
                  <Text
                    className="font-psemibold text-sm text-white"
                    numberOfLines={1}
                  >
                    {user?.username}
                  </Text>
                  {user?.role === "admin" ? (
                    <MaterialIcons name="verified" size={14} color="#6834ce" />
                  ) : user?.role === "verified" ? (
                    <MaterialIcons name="verified" size={14} color="#FF9C01" />
                  ) : user?.role === "suspended" ? (
                    <MaterialCommunityIcons
                      name="account-cancel"
                      size={18}
                      color="red"
                    />
                  ) : (
                    <></>
                  )}
                </View>

                <Text
                  className="text-xs text-gray-100 font-pregular"
                  numberOfLines={1}
                >
                  {user?.email}
                </Text>

                <Text
                  className="text-xs text-gray-100 font-pregular"
                  numberOfLines={1}
                >
                  {timeAgo(user?.$createdAt)}
                </Text>

                <Text
                  className="text-xs text-gray-100 font-pregular"
                  numberOfLines={1}
                >
                  ID: {user?.$id}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="h-[0.5px]   bg-gray-100 mx-5 my-5 "></View>
    </TouchableOpacity>
  );
};

export default UserCard;
