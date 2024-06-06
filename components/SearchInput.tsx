import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({
  initialQuery,
  type,
}: {
  initialQuery?: string;
  type?: string;
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white   h-full flex-1 font-pregular"
        value={query}
        placeholder={
          type === "event" ? "Search for nearby 'Events'" : `Search "News" `
        }
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        className="bg-black-200 p-3 rounded-full"
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (type === "event") {
            if (pathname.startsWith("/eventsearch"))
              router.setParams({ query });
            else router.push(`/eventsearch/${query.trim()}`);
          } else {
            if (pathname.startsWith("/search")) router.setParams({ query });
            else router.push(`/search/${query.trim()}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
