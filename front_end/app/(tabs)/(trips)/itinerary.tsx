import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Fontisto, Entypo, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { getItinerary } from "@/lib/api/geminiAPI";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ItineraryScreen() {
    const [activeTab, setActiveTab] = useState("itinerary");
    const [activeDay, setActiveDay] = useState("day1");
    const [coorList, setCoorList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationList, setLocationList] = useState<any>(null);

    const searchParams = useSearchParams();
    const place = searchParams.get("place");
    const params = useLocalSearchParams();

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Kiểm tra và parse dữ liệu từ params
                if (!params.locations) {
                    throw new Error("Không tìm thấy dữ liệu lịch trình");
                }

                let parsedData;
                try {
                    parsedData = JSON.parse(params.locations as string);
                } catch (parseError) {
                    console.error("Lỗi khi parse JSON:", parseError);
                    throw new Error("Dữ liệu lịch trình không hợp lệ");
                }

                // Kiểm tra cấu trúc dữ liệu
                if (!parsedData || !parsedData.itineraryData) {
                    throw new Error("Cấu trúc dữ liệu lịch trình không hợp lệ");
                }

                setLocationList(parsedData);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError(err instanceof Error ? err.message : "Không thể tải dữ liệu lịch trình. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [params.locations]);

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-gray-600 mt-4">Đang tải lịch trình...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center p-4">
                    <Text className="text-red-500 text-lg text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        onPress={handleBack}
                        className="bg-blue-500 px-6 py-3 rounded-full"
                    >
                        <Text className="text-white font-semibold">Quay lại</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!locationList?.itineraryData?.[activeDay]) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center p-4">
                    <Text className="text-gray-600 text-lg text-center mb-4">
                        Không tìm thấy dữ liệu cho ngày này
                    </Text>
                    <TouchableOpacity
                        onPress={handleBack}
                        className="bg-blue-500 px-6 py-3 rounded-full"
                    >
                        <Text className="text-white font-semibold">Quay lại</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-[#F9FAFB]">
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-4 z-10 bg-white p-2 rounded-full shadow-sm">
                    <AntDesign name="arrowleft" size={24} color="#3B82F6" />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {/* Tiêu đề */}
                    <Text className="text-4xl font-extrabold text-center text-blue-600 mb-8 mt-8">Lịch trình du lịch</Text>

                    {/* Thông tin chung */}
                    <View className="flex-row justify-between items-center bg-white rounded-2xl p-4 shadow-sm mb-6">
                        <View className="flex-row items-center gap-2">
                            <Entypo name="location" size={24} color="#3B82F6" />
                            <Text className="text-lg font-medium text-gray-700">Đà Nẵng</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Fontisto name="clock" size={24} color="#3B82F6" />
                            <Text className="text-lg font-medium text-gray-700">{params.time} ngày</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row justify-around mb-6">
                        <TouchableOpacity
                            onPress={handleBack}
                            className={`px-6 py-3 rounded-full shadow-sm ${activeTab === "list"
                                    ? "bg-blue-500"
                                    : "bg-white border border-gray-200"
                                }`}
                        >
                            <Text className={`text-base font-semibold ${activeTab === "list" ? "text-white" : "text-gray-700"
                                }`}>
                                Danh sách
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab("itinerary")}
                            className={`px-6 py-3 rounded-full shadow-sm ${activeTab === "itinerary"
                                    ? "bg-blue-500"
                                    : "bg-white border border-gray-200"
                                }`}
                        >
                            <Text className={`text-base font-semibold ${activeTab === "itinerary" ? "text-white" : "text-gray-700"
                                }`}>
                                Lịch trình
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Ngày */}
                    <View className="flex-row justify-between mb-6">
                        {Array.from({ length: Number(params.time) }, (_, index) => index + 1).map((day) => {
                            const dayKey = `day${day}`;
                            const widthPercentage = 100 / Number(params.time);
                            return (
                                <TouchableOpacity
                                    key={dayKey}
                                    onPress={() => setActiveDay(dayKey)}
                                    style={{ width: `${widthPercentage}%` }}
                                    className={`px-4 py-3 rounded-xl mr-2 shadow-sm ${activeDay === dayKey
                                            ? "bg-blue-500"
                                            : "bg-white border border-gray-200"
                                        }`}
                                >
                                    <Text className={`text-center font-semibold ${activeDay === dayKey ? "text-white" : "text-gray-700"
                                        }`}>
                                        Ngày {day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Bản đồ */}
                    <View className="h-64 bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
                        <MapView
                            style={{ width: "100%", height: "100%" }}
                            initialRegion={{
                                latitude: 16.047079,
                                longitude: 108.206230,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            {locationList.itineraryData[activeDay].map((location: any, index: number) => (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: location.location.coordinates.lat,
                                        longitude: location.location.coordinates.lon
                                    }}
                                    title={location.location.name}
                                />
                            ))}
                            <Polyline
                                coordinates={locationList.itineraryData[activeDay].map((location: any) => ({
                                    latitude: location.location.coordinates.lat,
                                    longitude: location.location.coordinates.lon,
                                }))}
                                strokeColor="#3B82F6"
                                strokeWidth={4}
                            />
                        </MapView>
                    </View>

                    {/* Danh sách địa điểm */}
                    <View className="mb-6">
                        {locationList.itineraryData[activeDay]?.length > 0 ? (
                            locationList.itineraryData[activeDay].map((location: any, index: number) => (
                                <View
                                    key={index}
                                    className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                                >
                                    <View className="flex-row items-center">
                                        <Image
                                            className="w-24 h-24 rounded-xl"
                                            source={{ uri: location.location.image }}
                                            resizeMode="cover"
                                        />
                                        <View className="ml-4 flex-1">
                                            <Text className="text-lg font-bold text-gray-800">
                                                {location.location.name}
                                            </Text>
                                            <Text className="text-sm text-gray-600 mt-1">
                                                {location.location.address}
                                            </Text>
                                            <View className="flex-row items-center mt-1">
                                                <Text className="text-sm text-yellow-500 font-medium">
                                                    {location.location.rating} ★
                                                </Text>
                                                <Text className="text-sm text-green-500 ml-auto font-medium">
                                                    {location.time}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="bg-white rounded-2xl p-6 shadow-sm">
                                <Text className="text-center text-gray-500 text-lg">
                                    Không có địa điểm nào.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
                {/* Nút Xong */}
                <TouchableOpacity
                    className="bg-green-500 px-6 py-4 rounded-full shadow-lg mb-6"
                    onPress={() => router.replace("/(tabs)/(trips)/trip")}
                >
                    <Text className="text-lg text-white text-center font-semibold tracking-wide">
                        Xong
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}