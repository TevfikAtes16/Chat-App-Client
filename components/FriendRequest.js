import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserType } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptedRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        "https://chatapp-rn-uqkq.onrender.com/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );
      if (response.status === 200) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Friends");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
        resizeMode="contain"
      />
      <Text
        style={{ fontSize: 15, fontWeight: "500", flex: 1, marginLeft: 10 }}
      >
        {item?.name} sana bir arkadaşlık isteği gönderdi!!
      </Text>
      <Pressable
        onPress={() => acceptedRequest(item._id)}
        style={{ backgroundColor: "#0866b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
