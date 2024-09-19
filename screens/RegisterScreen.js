import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };
    // Sunucuya post isteği gönder ve kullanıcıyı kaydet
    axios
      .post("https://chatapp-rn-uqkq.onrender.com/register", user)
      .then((response) => {
        console.log(response.data);
        Alert.alert("User registered successfully");
        setEmail("");
        setName("");
        setPassword("");
        setImage("");
        navigation.navigate("Login");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("User registration failed or using your email");
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView>
          <View
            style={{
              marginTop: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#4A55A2", fontSize: 19, fontWeight: "600" }}>
              Kayıt Ol
            </Text>
            <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
              Hesabınızı oluşturun
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
                }}
                placeholderTextColor={"black"}
                placeholder="Emailinizi girin"
              />
            </View>
          </View>

          <View style={{ marginTop: 15 }}>
            {/* Password */}
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
                }}
                placeholderTextColor={"black"}
                placeholder="Şifre girin"
              />
            </View>

            <View style={{ marginTop: 15 }}>
              {/* Name */}
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                İsim
              </Text>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  fontSize: 18,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginVertical: 10,
                  padding: 8,
                  width: 300,
                  borderRadius: 10,
                }}
                placeholderTextColor={"black"}
                placeholder="İsminizi girin"
              />
            </View>
            <View style={{ marginTop: 15 }}>
              {/* Image */}
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                Foto
              </Text>
              <TextInput
                value={image}
                onChangeText={(text) => setImage(text)}
                style={{
                  fontSize: 18,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginVertical: 10,
                  padding: 8,
                  width: 300,
                  borderRadius: 10,
                }}
                placeholderTextColor={"black"}
                placeholder="Foto linki girin"
              />
            </View>

            <Pressable
              style={{
                width: 200,
                backgroundColor: "#4A55A2",
                padding: 15,
                marginTop: 25,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: 6,
              }}
              onPress={handleRegister}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Kayıt Ol
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginTop: 15 }}
            >
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}
              >
                Hesabınız zaten var mı?
                <Text style={{ color: "#4A55A2" }}> Giriş Yap</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
