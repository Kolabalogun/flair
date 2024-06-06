import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createEventPost, createVideoPost } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import UploadNews from "@/components/UploadNews";
import UploadEvent from "@/components/UploadEvent";
import CreateTab from "@/components/CreateTab";

export type CreateNewsFormType = {
  title: string;
  image: ImagePicker.ImagePickerAsset | null;
  author: string;
  desc: string;
  creator: string;
  type: string | undefined;
  trending: boolean;
};

export type CreateNewsEventFormType = {
  title: string;
  image: ImagePicker.ImagePickerAsset | null;
  author: string;
  desc: string;
  creator: string;
  date: Date;
  time: Date;
  location: string;
  trending: boolean;
  entryFee: string;
  seat: string;
  options: string[];
};

const initialState = {
  title: "",
  image: null,
  author: "",
  desc: "",
  creator: "",
  type: "others",
  trending: false,
};

const eventInitialState = {
  title: "",
  image: null,
  author: "",
  location: "",
  date: new Date(),
  time: new Date(),
  seat: "100",
  entryFee: "0",
  desc: "",
  creator: "",
  options: ["Accessible Venue"],
  trending: false,
};

const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<CreateNewsFormType>(initialState);

  const [eventForm, setEventForm] =
    useState<CreateNewsEventFormType>(eventInitialState);

  const [activeTab, setActiveTab] = useState("news");

  const { title, image, desc, type } = form;

  const openPicker = async (event?: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert("Error", "Image Upload Failed, Please Try Again!");
    }

    if (!result.canceled) {
      setForm({
        ...form,
        image: result.assets[0],
      });
    }
    if (!result.canceled && event) {
      setEventForm({
        ...eventForm,
        image: result.assets[0],
      });
    }
  };

  const submit = async () => {
    if (!title || !image || !desc || !type) {
      return Alert.alert("Error", "Please provide all fields");
    }

    const updatedForm = {
      ...form,
      trending: false,
      author: user?.username,
    };

    setUploading(true);
    try {
      await createVideoPost({
        ...updatedForm,
        creator: user?.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", "Unable to upload post");
      console.log(error);
    } finally {
      setForm(initialState);

      setUploading(false);
    }
  };

  const submitEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.image ||
      !eventForm.desc ||
      !eventForm.location ||
      !eventForm.entryFee ||
      !eventForm.seat
    ) {
      return Alert.alert("Error", "Please provide all fields");
    }

    const updatedForm = {
      ...eventForm,
      trending: false,
      author: user?.username,
    };

    setUploading(true);
    try {
      await createEventPost({
        ...updatedForm,
        creator: user?.$id,
      });

      Alert.alert("Success", "Event uploaded successfully");
      router.push("/event");
    } catch (error: any) {
      Alert.alert("Error", "Unable to upload event!");
      console.log(error);
    } finally {
      setEventForm(eventInitialState);

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <CreateTab activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "news" ? (
          <UploadNews
            form={form}
            openPicker={openPicker}
            setForm={setForm}
            uploading={uploading}
            submit={submit}
          />
        ) : (
          <UploadEvent
            eventForm={eventForm}
            openPicker={openPicker}
            setEventForm={setEventForm}
            uploading={uploading}
            submit={submitEvent}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
