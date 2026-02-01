import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyOtp } from "@/lib/api/userAPI";
import { MaterialIcons } from "@expo/vector-icons";

const OtpVerificationScreen = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email as string, otp);
      router.push({
        pathname: "/create_new_password",
        params: { email, otp },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Xác thực OTP thất bại";
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
        XÁC MINH OTP
      </Text>

      {/* OTP input */}
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
          placeholder="Nhập mã OTP"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222", textAlign: "center" }}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
        />
        <MaterialIcons name="vpn-key" size={22} color="#e91e63" />
      </View>

      <Text style={{ color: "#aaa", fontSize: 12, marginBottom: 16, width: 300, textAlign: "center" }}>
        Nhập mã OTP đã được gửi đến email: {email}
      </Text>

      {/* Verify button */}
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
        onPress={handleVerifyOtp}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Xác minh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationScreen;