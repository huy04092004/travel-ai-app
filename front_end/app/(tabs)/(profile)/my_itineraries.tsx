import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getUserInfo } from "@/lib/api/userAPI";
import { AntDesign } from "@expo/vector-icons";
import { ITINERARIES_API_URL } from "@/lib/config";

const API_URL = ITINERARIES_API_URL;

interface Itinerary {
  _id: string;
  createdAt: string;
  travelTime: number;
  // Thêm các trường khác nếu cần
}

export default function MyItinerariesScreen() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getUserInfo();
      const res = await fetch(`${API_URL}?userId=${user._id}`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu lịch trình");
      const data = await res.json();
      setItineraries(data);
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      setItineraries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xóa lịch trình",
      "Bạn có chắc chắn muốn xóa lịch trình này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Xóa thất bại");
              setItineraries((prev) => prev.filter((item) => item._id !== id));
            } catch (err) {
              Alert.alert("Lỗi", "Không thể xóa lịch trình");
            }
            setDeletingId(null);
          },
        },
      ]
    );
  };

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-gray-600">Đang tải lịch trình...</Text>
    </View>
  );

  if (error) return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-red-500 text-lg mb-4">{error}</Text>
      <TouchableOpacity onPress={() => router.back()} className="bg-blue-500 px-6 py-3 rounded-full">
        <Text className="text-white font-semibold">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-11 left-4 z-10 bg-white p-2 rounded-full shadow-sm">
        <AntDesign name="arrowleft" size={24} color="#3B82F6" />
      </TouchableOpacity>
      <Text className="text-3xl font-extrabold text-center text-blue-600 mb-8 mt-8">Các lịch trình của bạn</Text>
      <FlatList
        data={itineraries}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View className="bg-blue-50 rounded-2xl p-5 mb-4 shadow-sm flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-1"
              onPress={() => router.push({ pathname: "/(tabs)/(trips)/itinerary", params: { locations: JSON.stringify(item) } })}
            >
              <Text className="font-bold text-lg text-blue-700 mb-1">Lịch trình #{item._id.slice(-5)}</Text>
              <Text className="text-gray-700">Ngày tạo: {new Date(item.createdAt).toLocaleString()}</Text>
              <Text className="text-gray-700">Số ngày: {item.travelTime}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              className="ml-4 p-2"
              disabled={deletingId === item._id}
            >
              <AntDesign name="delete" size={24} color={deletingId === item._id ? '#ccc' : '#E5386D'} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">Không có lịch trình nào.</Text>}
      />
    </View>
  );
} 