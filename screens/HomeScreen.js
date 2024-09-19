import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import User from "../components/User";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>TefoChat</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => {
              navigation.navigate("Friends");
            }}
            name="people-outline"
            size={24}
            color="black"
          />
          <MaterialCommunityIcons
            onPress={handleLogout}
            name="logout"
            size={23}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.removeItem("authToken");
      if (!token) {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
          axios
            .get("https://chatapp-rn-uqkq.onrender.com/users/" + userId)
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
