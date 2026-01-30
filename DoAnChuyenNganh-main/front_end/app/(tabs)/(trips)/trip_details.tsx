import { AntDesign, Entypo, Fontisto } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import Attraction from "@/components/trips/Attraction";
import { useEffect, useState } from "react";
import { createItinerary } from "@/lib/api/geminiAPI";
import { useSearchParams } from "expo-router/build/hooks";
import { getUserInfo } from "@/lib/api/userAPI";
import { Location } from "@/lib/types/Location";
import React from "react";

export default function TripDetailsScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [locations, setLocations] = useState<any[]>([]);
    const [breakfasts, setBreakfasts] = useState<any[]>([]);
    const [dinners, setDinners] = useState<any[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [userId, setUserId] = useState<string | null>(null);
    const [itiId, setItiId] = useState<string | null>(null);

    const params = useLocalSearchParams();
    const time = params.time;
    let selectedHobbies: string[] = [];
    if (typeof params.travelType === "string") {
        try {
            selectedHobbies = JSON.parse(params.travelType);
        } catch (e) {
            selectedHobbies = [];
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsInitialLoading(true);
                setError(null);

                // Load locations
                if (typeof params.locations === "string") {
                    const parsed = JSON.parse(params.locations);
                    setLocations(parsed);
                }

                // Load breakfasts
                if (typeof params.breakfasts === "string") {
                    const parsed = JSON.parse(params.breakfasts);
                    setBreakfasts(parsed);
                }

                // Load dinners
                if (typeof params.dinners === "string") {
                    const parsed = JSON.parse(params.dinners);
                    setDinners(parsed);
                }

                // Thêm địa điểm mới nếu có param add_location
                if (typeof params.add_location === "string") {
                    try {
                        const newLoc = JSON.parse(params.add_location);
                        setLocations(prev => {
                            // Kiểm tra trùng _id
                            if (prev.some(l => l._id === newLoc._id)) return prev;
                            return [...prev, newLoc];
                        });
                    } catch (e) {}
                }

                // Load user info
                const userInfo = await getUserInfo();
                setUserId(userInfo._id);
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại.");
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadData();
    }, [params.locations, params.breakfasts, params.dinners, params.add_location]);

    const handleNavigateToItinerary = () => {
        if (!itiId) {
            Alert.alert("Thông báo", "Bạn chưa tạo lịch trình. Vui lòng tạo lịch trình trước khi xem.");
            return;
        }

        router.push({
            pathname: `/(tabs)/(trips)/itinerary`,
            params: {
                iti_id: itiId,
                time: time,
            }
        });
    };

    const handleCreateItinerary = async () => {
        try {
            if (!userId) {
                Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
                return;
            }

            if (!params.time) {
                Alert.alert("Lỗi", "Không tìm thấy thời gian du lịch.");
                return;
            }

            setIsLoading(true);
            const travelTime = Array.isArray(time) ? time[0] : time;

            // Prepare minimal data for API
            const minimalLocations = locations.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address
            }));

            const minimalBreakfasts = breakfasts.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address
            }));

            const minimalDinners = dinners.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address
            }));

            const mergedList = [...minimalBreakfasts, ...minimalLocations, ...minimalDinners];

            const response = await createItinerary({
                userId,
                travelTime,
                locations: mergedList
            });

            const iti_id = response.itineraryId.toString();
            setItiId(iti_id);

            Alert.alert("Thành công", "Lịch trình đã được tạo thành công!");

            router.push({
                pathname: `/(tabs)/(trips)/itinerary`,
                params: {
                    iti_id: iti_id,
                    time: time,
                    locations: JSON.stringify(response.itinerary, null, 2),
                }
            });
        } catch (error) {
            console.error("Error creating itinerary:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo lịch trình.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-600 mt-4">Đang tải dữ liệu...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center p-4">
                <Text className="text-red-500 text-lg text-center mb-4">{error}</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-blue-500 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.push("/(tabs)/(trips)/trip")} className="absolute top-20 left-4 z-10 bg-white p-2 rounded-full shadow-sm">
                <AntDesign name="arrowleft" size={24} color="#3B82F6" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                
                {/* Tiêu đề */}
                <Text className="text-4xl font-extrabold text-center text-blue-600 mb-8 mt-8">Lịch trình chi tiết</Text>

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
                        onPress={() => setActiveTab("list")}
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
                        onPress={() => {
                            setActiveTab("itinerary");
                            handleNavigateToItinerary();
                        }}
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

                {/* Các điểm tham quan */}
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-semibold text-gray-800">
                            Các điểm tham quan ({locations.length})
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowAll(!showAll)}
                            className="bg-gray-100 p-2 rounded-full"
                        >
                            <AntDesign
                                name={showAll ? "caretup" : "caretdown"}
                                size={20}
                                color="#4B5563"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-medium text-gray-700 mb-3">Điểm tham quan</Text>
                    {(showAll ? locations : locations.slice(0, 2)).map((item: Location) => (
                        <Attraction
                            key={item._id}
                            name={item.name}
                            description={item.description}
                            rating={item.rating}
                            image={item.image}
                            open_time={item.open_time}
                            onPress={() => { }}
                        />
                    ))}

                    {/* Ẩm thực */}
                    <Text className="text-lg font-medium text-gray-700 mt-6 mb-3">Ẩm thực</Text>
                    {[...breakfasts, ...dinners].map((item: Location) => (
                        <Attraction
                            key={item._id}
                            name={item.name}
                            description={item.description}
                            rating={item.rating}
                            image={item.image}
                            open_time={item.open_time}
                            onPress={() => { }}
                        />
                    ))}

                    {/* Thêm địa điểm */}
                    <TouchableOpacity
                        className="mt-6 bg-green-500 py-4 px-6 rounded-full shadow-lg"
                        onPress={() => router.push({
                            pathname: "/(tabs)/(trips)/add_location",
                            params: {
                                locations: JSON.stringify(locations),
                                breakfasts: JSON.stringify(breakfasts),
                                dinners: JSON.stringify(dinners),
                                time: time,
                                travelType: params.travelType ?? "[]",
                            }
                        })}
                    >
                        <Text className="text-center text-white font-semibold text-lg">
                            Thêm địa điểm
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nút lên lịch trình */}
                <TouchableOpacity
                    className={`bg-blue-600 px-6 py-4 rounded-full shadow-lg mb-6 ${isLoading ? "opacity-50" : ""
                        }`}
                    onPress={handleCreateItinerary}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <View className="flex-row items-center justify-center">
                            <AntDesign name="calendar" size={24} color="#ffffff" style={{ marginRight: 8 }} />
                            <Text className="text-lg font-semibold text-white">
                                Lên lịch trình chi tiết
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
