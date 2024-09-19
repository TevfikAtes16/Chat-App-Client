import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../context/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [recepientData, setRecepientData] = useState();
  const route = useRoute();
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const { recepientId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  //console.log(recepientId);
  const scrollViewRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };
  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://chatapp-rn-uqkq.onrender.com/messages/${userId}/${recepientId}`
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

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `https://chatapp-rn-uqkq.onrender.com/user/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecepientData();
  }, []);

  const handleSend = async (messageType, imageUrl) => {
    if (messageType !== "image" && !message) {
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);
      //   console.log(imageUrl);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }
      const response = await fetch("https://chatapp-rn-uqkq.onrender.com/messages", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.status === 200) {
        setMessage("");
        setSelectedImage("");
        fetchMessages();
        setLoading(false);
      } else {
        console.error("Failed to send message:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network request failed:", error);
    }
  };
  //   console.log("messages tıklandı", selectedMessages);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Entypo
            onPress={() => {
              navigation.goBack();
            }}
            name="chevron-left"
            size={24}
            color="black"
          />
          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recepientData?.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="arrow-undo" size={24} color="black" />
            <AntDesign name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessage(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  const deleteMessage = async (messageIds) => {
    try {
      const response = await fetch("https://chatapp-rn-uqkq.onrender.com/deletedMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messageIds,
        }),
      });
      if (response.status === 200) {
        fetchMessages();
        setSelectedMessages((prevMessages) =>
          prevMessages.filter((id) => !messageIds.includes(id))
        );
      } else {
        console.error("Failed to delete messages:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleSend("image", uri);
    }
  };

  const handleSelectMessage = (message) => {
    // console.log(message);
    const isSelected = selectedMessages.includes(message._id);
    if (isSelected) {
      setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((prevSelectedMessages) => [
        ...prevSelectedMessages,
        message._id,
      ]);
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                        margin: 5,
                        marginRight: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#ffffff",
                        padding: 10,
                        margin: 5,
                        marginLeft: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && {
                    backgroundColor: "#f0f0f0",
                    // width: "100%",
                    borderWidth: 0.3,
                    borderColor: "gray",
                  },
                ]}
              >
                <Text style={{ fontSize: 14, textAlign: "left" }}>
                  {item?.message}
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    textAlign: "right",
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl =
              "/Users/tevfi/OneDrive/Desktop/ChatApp-RN/Backend/files/";
            const newImageUrl = item.imageUrl.replace(/\\/g, "/");
            const filename = newImageUrl.split("/").pop();
            // console.log(filename);
            // console.log(baseUrl + filename);
            const source = {
              uri: baseUrl + filename,
            };

            // console.log(source);
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                        margin: 5,
                        marginRight: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#ffffff",
                        padding: 10,
                        margin: 5,
                        marginLeft: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    // onLoad={() => console.log("görüntü yüklendi")}
                    // onError={(e) => console.log("görüntü yükleme hatası", e)}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    position: "absolute",
                    right: 19,
                    bottom: 5,
                    marginTop: 5,
                  }}
                >
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 25 : 0,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
          placeholder="Type your messages..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          disabled={loading}
          onPress={() => {
            handleSend("text");
          }}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          showSearchBar={false}
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 300 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
