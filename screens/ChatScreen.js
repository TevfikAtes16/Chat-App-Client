import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";

const ChatScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `https://chatapp-rn-uqkq.onrender.com/accepted-friends/${userId}`
        );
        const data = await response.json();

        if (response.status === 200) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    acceptedFriendsList();
  }, []);

  // console.log("friends", acceptedFriends);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
