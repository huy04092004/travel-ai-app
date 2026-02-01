import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { forgotPassword } from "@/lib/api/userAPI";
import { MaterialIcons } from "@expo/vector-icons";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }
    try {
      const res = await forgotPassword(email);
      Alert.alert("Thành công", res.message);
      router.push({
        pathname: "/otp_verification",
        params: { email },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Gửi OTP thất bại";
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
        QUÊN MẬT KHẨU
      </Text>

      {/* Email input */}
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
          placeholder="Nhập email của bạn"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <MaterialIcons name="email" size={22} color="#e91e63" />
      </View>

      {/* Send OTP button */}
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
        onPress={handleSendOtp}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Gửi OTP</Text>
      </TouchableOpacity>

      <Text style={{ color: "#aaa", fontSize: 12, marginTop: 8, width: 300, textAlign: "center" }}>
        Chúng tôi sẽ gửi mã OTP đến email của bạn.
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;