import HobbyButton from "@/components/trips/HobbyButton";
import { getInterests } from "@/lib/api/interestAPI";
import { getLocationV2 } from "@/lib/api/locationAPI";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TripScreen() {
    const [location, setLocation] = useState("Đà Nẵng");
    const [time, setTime] = useState("");
    const timeNumber = parseInt(time) || 0;
    const [count, setCount] = useState(timeNumber);
    const [travelType, setTravelType] = useState<string[]>([]);
    const [interests, setInterests] = useState<{ name: string; description: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const data = await getInterests();
                setInterests(data);
            } catch (error) {
                console.error("Error fetching interests:", error);
            }
        };
        fetchInterests();
    }, []);

    const toggleTravelType = (type: string) => {
        setTravelType((prev) =>
            prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
        );
    };

    const getLocationListByHobby = async () => {
        if (!location || !time || travelType.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            const response = await getLocationV2(travelType, time);
            router.push({
                pathname: "/trip_details",
                params: {
                    locations: JSON.stringify(response.data.locations),
                    breakfasts: JSON.stringify(response.data.breakfasts),
                    dinners: JSON.stringify(response.data.dinners),
                    time: time,
                    travelType: JSON.stringify(travelType),
                },
            });
        } catch (error) {
            console.error("Error fetching location list by hobby:", error);
            alert("Đã xảy ra lỗi khi tạo lịch trình!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-[#F9FAFB]">
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text className="text-4xl font-extrabold text-center text-blue-600 mb-8">Tạo Lịch Trình</Text>

                    {/* Địa điểm */}
                    <View className="mb-6">
                        <Text className="text-lg font-medium text-gray-800 mb-2">Bạn muốn đi đâu?</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                            <Entypo name="location-pin" size={22} color="#3B82F6" />
                            <TextInput
                                placeholder="Nhập địa điểm (ví dụ: Đà Nẵng)"
                                value={location}
                                onChangeText={setLocation}
                                className="flex-1 text-base ml-3 text-gray-700"
                            />
                        </View>
                    </View>

                    {/* Thời gian nhập */}
                    <View className="mb-6">
                        <View className="relative">
                            <TextInput
                                placeholder="Bạn đi trong bao lâu? (Ngày)"
                                value={time}
                                onChangeText={(text) => {
                                    setTime(text);
                                    const num = parseInt(text) || 0;
                                    setCount(num);
                                }}
                                keyboardType="numeric"
                                className="border border-gray-300 rounded-2xl px-4 py-3 text-base pl-12 shadow bg-white text-gray-700"
                            />
                            <Fontisto name="clock" size={20} color="#3B82F6" style={{ position: "absolute", top: 14, left: 12 }} />
                        </View>
                    </View>

                    {/* Bộ đếm thời gian */}
                    <View className="mb-6 bg-blue-50 rounded-2xl p-5 shadow-sm">
                        <Text className="text-center text-blue-700 font-semibold text-lg mb-2">Số ngày du lịch</Text>
                        <View className="flex-row justify-around items-center">
                            <TouchableOpacity
                                onPress={() => {
                                    setCount((prev) => {
                                        const newCount = Math.max(prev - 1, 0);
                                        setTime(newCount.toString());
                                        return newCount;
                                    });
                                }}
                                className="bg-white border border-blue-200 rounded-full p-3 shadow-sm"
                            >
                                <Text className="text-xl text-blue-600 font-bold">−</Text>
                            </TouchableOpacity>

                            <Text className="text-2xl text-blue-800 font-extrabold">{count} ngày</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setCount((prev) => {
                                        const newCount = prev + 1;
                                        setTime(newCount.toString());
                                        return newCount;
                                    });
                                }}
                                className="bg-white border border-blue-200 rounded-full p-3 shadow-sm"
                            >
                                <Text className="text-xl text-blue-600 font-bold">+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sở thích */}
                    <View className="mb-6 bg-blue-50 rounded-2xl p-4">
                        <Text className="text-xl font-semibold mb-3 text-blackblack">Sở thích du lịch</Text>
                        <View className="flex flex-wrap flex-row gap-3">
                            {interests.map((interest) => (
                                <HobbyButton
                                    key={interest.name}
                                    title={interest.description}
                                    onPress={() => toggleTravelType(interest.description)}
                                    className={`px-4 py-2 rounded-full border shadow-sm ${travelType.includes(interest.description)
                                            ? "bg-blue-600 border-blue-400 text-white"
                                            : "bg-gray-800 border-gray-600 text-gray-200"
                                        }`}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Nút tạo lịch trình */}
                    <TouchableOpacity
                        className={`bg-blue-600 px-6 py-4 rounded-full shadow-lg ${loading ? "opacity-50" : ""}`}
                        onPress={getLocationListByHobby}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-lg text-white text-center font-semibold tracking-wide">
                                Tạo lịch trình du lịch
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
