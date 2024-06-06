import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TextInputProps,
  ActivityIndicator,
} from "react-native";

import { icons } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Extend FormFieldType with TextInputProps
type FormFieldType = TextInputProps & {
  title?: string;
  span?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  commentLoader?: boolean;
  commentfn?: () => void;
  type?: boolean;
};
const FormField = ({
  title,
  value,
  span,
  placeholder,
  handleChangeText,
  otherStyles,
  commentLoader,
  commentfn,
  type,
  ...props
}: FormFieldType) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">
        {title !== "comment" && title}
      </Text>
      {span && (
        <Text className="text-xs text-gray-100   font-pregular">{span}</Text>
      )}

      <View
        className={`w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 ${
          type ? "focus:border-[#511bb7] " : "focus:border-secondary"
        } flex flex-row justify-center items-center`}
      >
        {title === "Entry Fee" && (
          <View>
            <Image
              source={icons.naira}
              className="w-5 h-5 mr-2 -mt-1"
              resizeMode="contain"
            />
          </View>
        )}
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          multiline={title === "comment"}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {title === "comment" && (
          <TouchableOpacity
            className="ml-4"
            onPress={
              commentLoader
                ? () => console.log("waitt")
                : commentfn
                ? () => commentfn()
                : () => console.log("waitt")
            }
          >
            {commentLoader ? (
              <ActivityIndicator color={type ? "#511bb7" : "#FF9C01"} />
            ) : (
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={type ? "#511bb7" : "#FF9C01"}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
