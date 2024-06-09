import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  createEventPost,
  createVideoPost,
  searchUsers,
} from "../../lib/appwrite";
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
  $id: any;
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
  $id: "",
  title: "",
  image: null,
  author: "",
  location: "",
  date: new Date(),
  time: new Date(),
  seat: "0",
  entryFee: "0",
  desc: "",
  creator: "",
  options: ["Accessible Venue"],
  trending: false,
};

const Create = () => {
  const { user, expoPushToken, allexpoPushToken } = useGlobalContext();

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<CreateNewsFormType>(initialState);

  const [eventForm, setEventForm] =
    useState<CreateNewsEventFormType>(eventInitialState);

  const [activeTab, setActiveTab] = useState("news");

  const [adminExpoIDs, setAdminExpoIDs] = useState<string[]>([]);

  const { title, image, desc, type } = form;

  const openPicker = async (event?: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
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

  useEffect(() => {
    usersWithRoleAdmin();
  }, [user]);

  const usersWithRoleAdmin = async () => {
    try {
      const res = await searchUsers("role", "admin");

      if (res.length > 0) {
        const filtredRes = res
          ?.filter((user) => user.expo_Id)
          .map((user) => user.expo_Id);

        // Remove duplicates using a Set and convert back to array
        const uniqueExpoIds: string[] = Array.from(new Set(filtredRes));

        setAdminExpoIDs(uniqueExpoIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    if (!title || !image || !desc || !type) {
      return Alert.alert("Error", "Please provide all fields");
    }

    if (user?.role === "suspended") {
      return Alert.alert(
        "Error",
        "Your account has been suspended. Contact your administrator"
      );
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

      const formNotification = {
        title: "Flair",
        body: "Your Post have been Uploaded😊",
      };

      const adminNotification = {
        title: `News Post from ${user?.username}`,
        body: { title },
      };

      const newsNotification = {
        title: title,
        body: `${desc.substring(0, 100)}...`,
      };

      if (user?.role === "user") {
        sendPushNotification([expoPushToken], formNotification);
        sendPushNotification([...adminExpoIDs], adminNotification);
      } else sendPushNotification([...allexpoPushToken], newsNotification);

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
      !eventForm.entryFee
    ) {
      return Alert.alert("Error", "Please provide all fields");
    }

    if (user?.role === "suspended") {
      return Alert.alert(
        "Error",
        "Your account has been suspended. Contact your administrator"
      );
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

      const formNotification = {
        title: "Flair",
        body: "Your Event have been Uploaded😊",
      };
      const adminNotification = {
        title: `New Event Post from ${user?.username}`,
        body: { title },
      };

      const newsNotification = {
        title: title,
        body: `${desc.substring(0, 100)}...`,
      };

      if (user?.role === "user") {
        sendPushNotification([expoPushToken], formNotification);
        sendPushNotification([...adminExpoIDs], adminNotification);
      } else sendPushNotification([...allexpoPushToken], newsNotification);
      router.push("/event");
    } catch (error: any) {
      Alert.alert("Error", "Unable to upload event!");
      console.log(error);
    } finally {
      setEventForm(eventInitialState);

      setUploading(false);
    }
  };

  async function sendPushNotification(expoPushTokens: string[], form: any) {
    const successfulTokens = [];
    const failedTokens = [];

    // Loop through each token and send a notification
    for (const token of expoPushTokens) {
      const message = {
        to: token,
        sound: "default",
        ...form,
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const responseData = await response.json();

      if (responseData.data.status === "ok") {
        successfulTokens.push(token);
      } else {
        failedTokens.push(token);
      }
    }

    // Now, you have lists of successful and failed tokens
    console.log("Successful Tokens:", successfulTokens);
    console.log("Failed Tokens:", failedTokens);
  }

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
