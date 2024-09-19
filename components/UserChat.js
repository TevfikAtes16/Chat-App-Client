import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://chatapp-rn-uqkq.onrender.com/messages/${userId}/${item._id}`
      );
      const data = await response.json();
      if (response.status === 200) {
        // console.log(data);
        setMessages(data);
      } else {
        console.log("Failed to fetch messages", response.status.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;
    return userMessages[n - 1];
  };

  const lastMessage = getLastMessage();
  // console.log(lastMessage);

  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "contain",
        }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
          {lastMessage && (
            <Text
              style={{
                fontSize: 13,
                color: "gray",
                marginTop: 3,
                fontWeight: "500",
              }}
            >
              {lastMessage.senderId._id === userId ? "Sen: " : ""}
              {lastMessage.message}
            </Text>
          )}
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
