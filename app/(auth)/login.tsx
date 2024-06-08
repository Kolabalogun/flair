import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { Link, router } from "expo-router";
import { checkIfUserIsInDB, getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Login = () => {
  const { setUser, setIsLoggedIn, storeData } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all required fields");

      return;
    }

    setSubmitting(true);

    try {
      const res = await checkIfUserIsInDB(email.trim());

      if (res.length === 0)
        return Alert.alert("Error", "Invalid Email or Password");

      await signIn(email.trim(), password.trim());

      const result = await getCurrentUser();

      setIsLoggedIn(true);
      storeData(JSON.stringify(result));

      setUser(result);

      router.replace("/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Invalid Credentials");
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
            source={images.logoSmall}
            resizeMode="contain"
            className="w-[45px] h-[45px]"
          />

          <Text className="text-2xl font-semibold text-white mt-6 font-psemibold">
            Log in to Flair
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/register"
              className="text-sm font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
