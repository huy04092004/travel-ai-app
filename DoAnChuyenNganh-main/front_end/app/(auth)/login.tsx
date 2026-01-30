import { loginUser } from "@/lib/api/userAPI";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    try {
      const res = await loginUser({ email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          name: res.data.user.name,
          email: res.data.user.email,
          id: res.data.user.id,
        })
      );
      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.replace("/(tabs)/(home)");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";
      Alert.alert("Lỗi", message);
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#222",
      paddingHorizontal: 24,
    }}>
      <Text style={{
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        letterSpacing: 2,
        marginBottom: 32,
      }}>
        LOGIN QUICK
      </Text>

      {/* Email input */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 18,
        width: 300,
        height: 48,
      }}>
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <MaterialIcons name="person" size={22} color="#e91e63" />
      </View>

      {/* Password input */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 8,
        width: 300,
        height: 48,
      }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#e91e63" />
        </TouchableOpacity>
      </View>

      {/* Forgot password link */}
      <TouchableOpacity
        style={{ alignSelf: "flex-end", marginRight: 8, marginBottom: 28 }}
        onPress={() => router.push("/forgot_password")}
      >
        <Text style={{ color: "#fff", fontSize: 13, opacity: 0.8 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e91e63",
          borderRadius: 30,
          width: 300,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      {/* Register link */}
      <TouchableOpacity
        onPress={() => router.push("/register")}
        activeOpacity={0.7}
        style={{ marginTop: 8 }}
      >
        <Text style={{
          color: "#e91e63",
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          textDecorationLine: "underline",
          letterSpacing: 0.5,
        }}>
          Bạn chưa có tài khoản? Đăng ký ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;