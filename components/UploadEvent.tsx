import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import FormField from "./FormField";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { icons } from "@/constants";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native";
import CustomButton from "./CustomButton";
import { CreateNewsEventFormType } from "@/app/(tabs)/create";
import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatDate, formatTime } from "@/utils/formatDate";

type UploadEventType = {
  eventForm: CreateNewsEventFormType;
  setEventForm: React.Dispatch<React.SetStateAction<CreateNewsEventFormType>>;
  openPicker: (e: string) => void;
  submit: () => void;
  uploading: boolean;
};

const UploadEvent = ({
  eventForm,
  setEventForm,
  openPicker,
  submit,
  uploading,
}: UploadEventType) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mode, setMode] = useState<any | undefined>("datetime");

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date();

    setEventForm({ ...eventForm, date: currentDate });

    setShowPicker(false);
  };

  const showMode = (currentMode: string) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const onChangeTime = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date();
    setEventForm({ ...eventForm, time: currentDate });
    setShowTimePicker(false);
  };

  const showTimeMode = () => {
    setShowTimePicker(true);
  };

  return (
    <View className="  my-3">
      <Text className="text-2xl text-white font-psemibold">Register Event</Text>

      <FormField
        title="Event Name"
        value={eventForm.title}
        placeholder="Please enter the name of the event"
        handleChangeText={(e) => setEventForm({ ...eventForm, title: e })}
        otherStyles="mt-10"
      />

      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">
          Thumbnail Image
        </Text>

        <TouchableOpacity onPress={() => openPicker("event")}>
          {eventForm.image ? (
            <Image
              source={{ uri: eventForm.image.uri }}
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
        <Text className="text-base text-gray-100 font-pmedium">Date</Text>

        <TouchableOpacity onPress={() => showMode("date")}>
          <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
            <Text className="text-base text-gray-100 font-pmedium">
              {formatDate(eventForm.date)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">Time</Text>

        <TouchableOpacity onPress={() => showTimeMode()}>
          <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
            <Text className="text-base text-gray-100 font-pmedium">
              {formatTime(eventForm.time)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={eventForm.date}
          minimumDate={new Date()}
          mode={mode}
          themeVariant="dark"
          display="default"
          onChange={onChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={eventForm.time}
          mode={"time"}
          themeVariant="dark"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <FormField
        title="Location"
        value={eventForm.location}
        placeholder="Where is your event happening?"
        handleChangeText={(e) => setEventForm({ ...eventForm, location: e })}
        otherStyles="mt-10"
      />

      {/* <FormField
        title="Reservation"
        value={eventForm.seat}
        placeholder="How many seats available?"
        handleChangeText={(e) => setEventForm({ ...eventForm, seat: e })}
        otherStyles="mt-10"
        keyboardType="number-pad"
      /> */}

      <FormField
        title="Entry Fee"
        span="(Do not input any figure if the entry is Free)*"
        value={eventForm.entryFee}
        placeholder="0"
        handleChangeText={(e) => setEventForm({ ...eventForm, entryFee: e })}
        otherStyles="mt-10"
        keyboardType="number-pad"
      />

      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">Options</Text>

        <ScrollView horizontal className="flex-row space-x-2">
          {eventForm.options?.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                const filteredOptions = eventForm.options.filter(
                  (optt) => optt !== opt
                );

                setEventForm({
                  ...eventForm,
                  options: filteredOptions,
                });
              }}
              className="items-center justify-center flex-row p-2 bg-black-200 border-2 border-black-100"
            >
              <Text className="text-gray-100 mr-3">{opt}</Text>

              <FontAwesome6 name="times-circle" size={16} color="#c8c8c8" />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center    space-x-2">
          <Picker
            // selectedValue={eventForm?.type}
            onValueChange={(itemValue: string) => {
              let updateoptionss;
              if (eventForm.options?.includes(itemValue)) {
                updateoptionss = eventForm.options.filter(
                  (optt: string) => optt !== itemValue
                );
              } else {
                updateoptionss = [itemValue as string, ...eventForm.options];
              }

              setEventForm({
                ...eventForm,
                options: [itemValue as string, ...eventForm.options],
              });
            }}
            style={{ color: "#fff" }}
            dropdownIconRippleColor="#fff"
            dropdownIconColor={"#fff"}
          >
            <Picker.Item label="Accessible Venue" value="Accessible Venue" />
            <Picker.Item label="Covid19 Protocol" value="Covid19 Protocol" />
            <Picker.Item label="Free Entry" value="Free Entry" />
            <Picker.Item label="Paid Entry" value="Paid Entry" />
            <Picker.Item label="Online Meeting" value="Online Meeting" />
            <Picker.Item label="Outdoor" value="Outdoor" />
            <Picker.Item label="No Smoking" value="No Smoking" />
            <Picker.Item
              label="Dress Code: Formal"
              value="Dress Code: Formal"
            />
            <Picker.Item label="18+ Only" value="18+ Only" />

            <Picker.Item label="No Refunds" value="No Refunds" />

            <Picker.Item
              label="Early Arrival Recommended"
              value="Early Arrival Recommended"
            />
            <Picker.Item label="Parking Available" value="Parking Available" />
          </Picker>
        </View>
      </View>

      <View className={`space-y-2 mt-7`}>
        <Text className="text-base text-gray-100 font-pmedium">
          Event Details
        </Text>

        <View className="w-full h-72 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
          <TextInput
            className="flex-1 text-white h-full py-5 font-psemibold text-base"
            value={eventForm.desc}
            placeholder="blah blah blahh...."
            placeholderTextColor="#7B7B8B"
            onChangeText={(e) => setEventForm({ ...eventForm, desc: e })}
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

export default UploadEvent;
