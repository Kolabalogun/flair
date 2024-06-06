import { View, Text, Modal, FlatList } from "react-native";
import React from "react";
import CommentCard from "./CommentCard";
import Header from "./Header";
import { icons, images } from "@/constants";
import EmptyState from "./EmptyState";
import FormField from "./FormField";

interface ModalComponentType {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children?: any;
  comment: string;
  type?: boolean;
  bookticket?: string;
  comments: any;
  deleteDocument: (form: any, type: string) => void;
  commentLoader: boolean;
  submitComment: () => void;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}

const ModalComponent = ({
  modalVisible,
  setModalVisible,
  children,
  comment,
  comments,
  deleteDocument,
  commentLoader,
  submitComment,
  setComment,
  bookticket,
  type,
}: ModalComponentType) => {
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View className=" flex-1 h-full  bg-primary">
        {bookticket === "bookticket" ? (
          children
        ) : bookticket === "seats" ? (
          <View className="flex-1">
            <FlatList
              data={comments}
              keyExtractor={(item) => item.$id.toLocaleString()}
              renderItem={({ item }) => (
                <CommentCard
                  {...item}
                  type={type}
                  deleteDoc={deleteDocument}
                  itm={item}
                />
              )}
              ListHeaderComponent={() => (
                <View>
                  <Header
                    title={"Reservations"}
                    fn={() => setModalVisible(!modalVisible)}
                    img={icons.al}
                    img2={images.logoSmall}
                  />

                  <View className="w-full     bg-gray-100 h-[1px] mb-5"></View>
                </View>
              )}
            />
          </View>
        ) : (
          <View className="flex-1">
            <FlatList
              data={comments}
              keyExtractor={(item) => item.$id.toLocaleString()}
              renderItem={({ item }) => (
                <CommentCard
                  {...item}
                  type={type}
                  deleteDoc={deleteDocument}
                  itm={item}
                />
              )}
              ListHeaderComponent={() => (
                <View>
                  <Header
                    title={"Comments"}
                    fn={() => setModalVisible(!modalVisible)}
                    img={icons.al}
                    img2={images.logoSmall}
                  />

                  <View className="w-full     bg-gray-100 h-[1px] mb-5"></View>
                </View>
              )}
              ListEmptyComponent={() => (
                <EmptyState
                  title="No Comment Found"
                  subtitle="Post a comment"
                />
              )}
            />

            <View className="mb-4 mx-4">
              <FormField
                title="comment"
                value={comment}
                commentLoader={commentLoader}
                commentfn={submitComment}
                placeholder="Enter your comment here..."
                handleChangeText={(e) => setComment(e)}
                otherStyles="mt-10"
                type={type}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ModalComponent;
