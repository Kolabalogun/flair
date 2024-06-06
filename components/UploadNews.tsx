import { View, Text } from "react-native";
import React from "react";
import FormField from "./FormField";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { icons } from "@/constants";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native";
import CustomButton from "./CustomButton";

const UploadNews = ({ form, openPicker, setForm, submit, uploading }: any) => {
  return (
    <View className="  my-3">
      <Text className="text-2xl text-white font-psemibold">Upload News</Text>

      <FormField
        title="News Title"
        value={form.title}
        placeholder="Give your news a catchy title..."
        handleChangeText={(e) => setForm({ ...form, title: e })}
        otherStyles="mt-10"
      />

      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">
          Thumbnail Image
        </Text>

        <TouchableOpacity onPress={() => openPicker()}>
          {form.image ? (
            <Image
              source={{ uri: form.image.uri }}
              resizeMode="cover"
              className="w-full h-64 rounded-2xl"
            />
          ) : (
            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
              <Image
                source={icons.upload}
                resizeMode="contain"
                alt="upload"
                className="w-5 h-5"
              />
              <Text className="text-sm text-gray-100 font-pmedium">
                Choose a file
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">Type</Text>
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center    space-x-2">
          <Picker
            selectedValue={form?.type}
            onValueChange={(itemValue, itemIndex) =>
              setForm({ ...form, type: itemValue })
            }
            style={{ color: "#fff" }}
            dropdownIconRippleColor="#fff"
            dropdownIconColor={"#fff"}
          >
            <Picker.Item label="Others" value="others" />
            <Picker.Item label="Education" value="education" />
            {/* <Picker.Item label="Entertainment" value="entertainment" /> */}
            <Picker.Item label="Event" value="event" />
            <Picker.Item label="Sports" value="sports" />
          </Picker>
        </View>
      </View>

      <View className={`space-y-2 mt-7`}>
        <Text className="text-base text-gray-100 font-pmedium">
          News Details
        </Text>

        <View className="w-full h-72 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
          <TextInput
            className="flex-1 text-white h-full py-5 font-psemibold text-base"
            value={form.desc}
            placeholder="blah blah blahh...."
            placeholderTextColor="#7B7B8B"
            onChangeText={(e) => setForm({ ...form, desc: e })}
            multiline
            textAlignVertical="top"
            numberOfLines={10}
          />
        </View>
      </View>

      <CustomButton
        title="Submit & Publish"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={uploading}
      />
    </View>
  );
};

export default UploadNews;
