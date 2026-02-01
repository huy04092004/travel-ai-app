import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, router } from "expo-router";
import { addUser } from "@/lib/api/userAPI";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }
    try {
      await addUser({ name, email, password });
      Alert.alert("Thành công", "Đăng ký thành công!");
      router.replace("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng ký thất bại";
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
        ĐĂNG KÝ
      </Text>

      {/* Name input */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 16,
        width: 300,
        height: 48,
      }}>
        <TextInput
          placeholder="Tên tài khoản"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={name}
          onChangeText={setName}
        />
        <MaterialIcons name="person" size={22} color="#e91e63" />
      </View>

      {/* Email input */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 16,
        width: 300,
        height: 48,
      }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <MaterialIcons name="email" size={22} color="#e91e63" />
      </View>

      {/* Password input */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 16,
        width: 300,
        height: 48,
      }}>
        <TextInput
          placeholder="Mật khẩu"
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

      {/* Confirm password input */}
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
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color="#e91e63" />
        </TouchableOpacity>
      </View>

      <Text style={{ color: "#aaa", fontSize: 12, marginBottom: 16, width: 300 }}>
        Mật khẩu phải có ít nhất 8 ký tự, bao gồm số và ký tự đặc biệt
      </Text>

      {/* Register button */}
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
        onPress={handleRegister}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Login link */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
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
          Bạn đã có tài khoản? Đăng nhập ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
}
