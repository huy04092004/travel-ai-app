import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { getUserInfo } from "@/lib/api/userAPI";
import { AntDesign } from "@expo/vector-icons";
import { ITINERARIES_API_URL } from "@/lib/config";

const API_URL = ITINERARIES_API_URL;

export default function AddTripScreen() {
  const [travelTime, setTravelTime] = useState("");
  const [locations, setLocations] = useState<string[]>([]); // Danh sách địa điểm
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    setLocations([...locations, newLocation.trim()]);
    setNewLocation("");
  };

  const handleRemoveLocation = (idx: number) => {
    setLocations(locations.filter((_, i) => i !== idx));
  };

  const handleAddTrip = async () => {
    if (!travelTime) {
      Alert.alert("Lỗi", "Vui lòng nhập số ngày!");
      return;
    }
    if (locations.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một địa điểm!");
      return;
    }
    setLoading(true);
    try {
      const user = await getUserInfo();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          travelTime: Number(travelTime),
          locations: locations,
          itineraryData: {},
        }),
      });
      if (!res.ok) throw new Error("Tạo lịch trình thất bại");
      Alert.alert("Thành công", "Đã tạo lịch trình mới!");
      router.back();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tạo lịch trình");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-green-200 px-6">
      <Text className="text-2xl font-bold mb-6">Tạo lịch trình mới</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4 w-full"
        placeholder="Số ngày du lịch"
        keyboardType="numeric"
        value={travelTime}
        onChangeText={setTravelTime}
      />
      <View className="w-full mb-4">
        <Text className="mb-2 font-semibold">Địa điểm sẽ đi</Text>
        <FlatList
          data={locations}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center mb-2 bg-white rounded-xl px-3 py-2">
              <Text className="flex-1 text-base">{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveLocation(index)}>
                <AntDesign name="closecircle" size={20} color="#E5386D" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text className="text-gray-500">Chưa có địa điểm nào.</Text>}
        />
        <View className="flex-row mt-2">
          <TextInput
            className="flex-1 bg-white rounded-xl px-4 py-2 mr-2"
            placeholder="Thêm địa điểm..."
            value={newLocation}
            onChangeText={setNewLocation}
          />
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-xl justify-center"
            onPress={handleAddLocation}
          >
            <Text className="text-white font-semibold">Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-blue-600 px-6 py-4 rounded-full shadow-lg w-full"
        onPress={handleAddTrip}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-lg text-white text-center font-semibold">Tạo lịch trình</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
