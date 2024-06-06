import { View, Text, TouchableOpacity, Image } from "react-native";

import { Comment } from "@/app/news/[query]";
import { timeAgo } from "@/utils/timeAgo";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";

const CommentCard = ({
  desc,
  creator,
  $createdAt,
  deleteDoc,
  itm,
  type,
}: any) => {
  const { user } = useGlobalContext();

  return (
    <View>
      <View className="flex flex-col   px-4 mt-0  ">
        <View className="flex flex-row gap-1 items-start  ">
          <View
            className={`w-[46px] h-[46px] rounded-lg border ${
              type ? "border-[#511bb7] " : "border-secondary"
            } flex justify-center items-center p-0.5`}
          >
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1   ">
            <View className="flex mt-1 justify-center items-center flex-row flex-1">
              <View className="flex justify-center flex-1 ml-3 gap-y-1">
                <Text
                  className="font-psemibold text-sm text-white"
                  numberOfLines={1}
                >
                  {creator.username}
                </Text>
                <Text
                  className="text-xs text-gray-100 font-pregular"
                  numberOfLines={1}
                >
                  {timeAgo($createdAt)}
                </Text>
              </View>
              {creator?.$id === user?.$id && (
                <TouchableOpacity
                  onPress={() => deleteDoc(itm, "comment")}
                  className=" "
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={22}
                    color="#c8c8c8"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="ml-3 mt-3">
              <Text className="text-white font-pregular ">{desc}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="h-[0.5px]   bg-gray-100 mx-5 my-5 "></View>
    </View>
  );
};

export default CommentCard;
