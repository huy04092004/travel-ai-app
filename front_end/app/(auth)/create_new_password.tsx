import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "@/lib/api/userAPI"; // Import resetPassword function
import { MaterialIcons } from "@expo/vector-icons";

const CreateNewPasswordScreen = () => {
  const { email, otp } = useLocalSearchParams(); // Retrieve email and OTP from navigation params
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter(); // Initialize router for navigation

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt";
    }
    return null;
  };

  const handleCreateNewPassword = async () => {
    try {
      if (!newPassword) {
        Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới");
        return;
      }

      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        Alert.alert("Lỗi", passwordError);
        return;
      }

      // Call the resetPassword API
      const response = await resetPassword(email as string, otp as string, newPassword);
      console.log("Password reset successfully:", response);

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công");
      router.replace("/login"); // Navigate to the login screen
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đặt lại mật khẩu thất bại";
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
        TẠO MẬT KHẨU MỚI
      </Text>

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
          placeholder="Nhập mật khẩu mới"
          placeholderTextColor="#888"
          style={{ flex: 1, fontSize: 16, color: "#222" }}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <MaterialIcons name="lock" size={22} color="#e91e63" />
      </View>

      <Text style={{ color: "#aaa", fontSize: 12, marginBottom: 16, width: 300 }}>
        Mật khẩu phải có ít nhất 8 ký tự, bao gồm số và ký tự đặc biệt
      </Text>

      {/* Reset password button */}
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
        onPress={handleCreateNewPassword}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPasswordScreen;