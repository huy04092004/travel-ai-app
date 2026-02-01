import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const WelcomeScreen = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#222",
      paddingHorizontal: 24,
    }}>
      {/* Logo/Icon */}
      <MaterialIcons name="home" size={64} color="#fff" style={{ marginBottom: 16 }} />
      <Text style={{
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 2,
        marginBottom: 4,
      }}>
        HuuThinh
      </Text>
      <Text style={{
        color: "#e91e63",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 32,
        letterSpacing: 2,
      }}>
        Travel
      </Text>
      <Text style={{
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 18,
        letterSpacing: 1,
      }}>
        XIN CHÀO !
      </Text>
      <Text style={{
        color: "#aaa",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 32,
      }}>
        Bạn muốn đăng nhập ngay bây giờ{"\n"}hay tiếp tục với tư cách khách?
      </Text>
      {/* Login Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e91e63",
          borderRadius: 30,
          width: 300,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
          elevation: 4, // Android shadow
          shadowColor: "#e91e63", // iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        onPress={() => router.push('/login')}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Đăng nhập</Text>
      </TouchableOpacity>
      {/* Guest Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderRadius: 30,
          width: 300,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
        onPress={() => router.push('/')}
      >
        <Text style={{ color: "#e91e63", fontSize: 18, fontWeight: "bold" }}>Khách</Text>
      </TouchableOpacity>
      {/* Register Link */}
      <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
        <Text style={{
          color: "#e91e63",
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          textDecorationLine: "underline",
          letterSpacing: 0.5,
        }}>
          Tạo tài khoản mới tại đây
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;