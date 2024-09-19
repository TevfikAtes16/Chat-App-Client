import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/UserContext";
import axios from "axios";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `https://chatapp-rn-uqkq.onrender.com/friend-request/sent/${userId}`
        );
        const data = await response.json();
        if (response.status === 200) {
          setFriendRequests(data);
        } else {
          console.log(
            "Failed to fetch friend requests",
            response.status.message
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequests();
  }, [friendRequests]);
  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `https://chatapp-rn-uqkq.onrender.com/friends/${userId}`
        );
        const data = await response.json();
        if (response.status === 200) {
          setUserFriends(data);
        } else {
          console.log("Failed to fetch user friends", response.status.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFriends();
  }, [userFriends]);
  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await axios.post(
        "https://chatapp-rn-uqkq.onrender.com/friend-request",
        { currentUserId, selectedUserId }
      );
      if (response.status === 200) {
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  // console.log("friendRequests", friendRequests);
  // console.log("userFriends", userFriends);
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "contain",
          }}
          source={{ uri: item.image }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>

      {userFriends.includes(item._id) || friendRequests.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#B2CD47",
            padding: 10,
            width: 110,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Arkadaş
          </Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 110,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            İstek Atıldı
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 110,
          }}
          onPress={() => {
            sendFriendRequest(userId, item._id);
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Arkadaşı Ekle
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
