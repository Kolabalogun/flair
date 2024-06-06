import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

type HeaderType = {
  title: string;
  fn: () => void;
  img: ImageSourcePropType | undefined;
  img2: ImageSourcePropType | undefined;
};

const Header = ({ title, fn, img, img2 }: HeaderType) => {
  return (
    <View className="flex my-6 px-4  justify-between items-center flex-row">
      <TouchableOpacity onPress={fn} className="">
        <Image
          source={img}
          resizeMode="contain"
          style={{ height: img ? 24 : 20, width: img ? 24 : 20 }}
        />
      </TouchableOpacity>
      <View>
        <Text className="text-gray-200 text-lg font-pmedium capitalize">
          {title}
        </Text>
        <View className="w-4 self-center   bg-secondary h-[2px]"></View>
      </View>
      <TouchableOpacity className="">
        <Image
          source={img2}
          resizeMode="contain"
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
