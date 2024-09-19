import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Home");
        } else {
          //token not found
          navigation.navigate("Login");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };
    // Sunucuya post isteği gönder ve kullanıcıyı kaydet
    axios
      .post("https://chatapp-rn-uqkq.onrender.com/login", user)
      .then((response) => {
        // console.log(response.data);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Error", "Invalid email or password");
        console.log(error);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 19, fontWeight: "600" }}>
            Giriş Yap
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Hesabınızla Giriş Yapın
          </Text>
        </View>

        {/* Email */}
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: 18,
                borderColor: "gray",
                borderWidth: 1,
                marginVertical: 10,
                padding: 8,
                width: 300,
                borderRadius: 10,
                // height: 50,
              }}
              placeholderTextColor={"black"}
              placeholder="Emailinizi girin"
            />
          </View>
        </View>

        {/* Password */}
        <View style={{ marginTop: 15 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Şifre
            </Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: 18,
                borderColor: "gray",
                borderWidth: 1,
                marginVertical: 10,
                padding: 8,
                width: 300,
                borderRadius: 10,
                // height: 50,
              }}
              placeholderTextColor={"black"}
              placeholder="Şifrenizi girin"
            />
          </View>

          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Giriş Yap
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Hesabınız yok mu?{" "}
              <Text style={{ color: "#4A55A2" }}> Kayıt ol</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
