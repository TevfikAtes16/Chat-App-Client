import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../context/UserContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchFriendsRequests();
  }, []);

  const fetchFriendsRequests = async () => {
    try {
      const response = await axios.get(
        `https://chatapp-rn-uqkq.onrender.com/friend-request/${userId}`
      );
      if (response.status === 200) {
        // console.log(response.data);
        const friendRequests = response.data.map((request) => ({
          _id: request._id,
          name: request.name,
          email: request.email,
          image: request.image,
        }));
        setFriendRequests(friendRequests); // set the friend requests in the state
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   console.log(friendRequests);

  return (
    <ScrollView>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
        {friendRequests.length > 0 && <Text>Arkadaşlık İstekleri! </Text>}
        {friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
