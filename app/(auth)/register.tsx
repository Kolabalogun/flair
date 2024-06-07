import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Register = () => {
  const { setUser, setIsLoggedIn, expoPushToken, storeData } =
    useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { email, password, username } = form;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submit = async () => {
    if (!email || !username || !password) {
      Alert.alert("Error", "Please fill in all required fields");

      return;
    }

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be more than 2 characters");
      return;
    }
    if (username.length > 10) {
      Alert.alert("Error", "Username must be more than 10 characters");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be more than 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createUser(
        email.trim(),
        password.trim(),
        username.trim(),
        expoPushToken
      );

      setIsLoggedIn(true);
      setUser(result);

      storeData(JSON.stringify(result));

      Alert.alert("Success", "User signed in successfully");

      router.replace("/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Error trying to sign up. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Flair
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-sm font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
