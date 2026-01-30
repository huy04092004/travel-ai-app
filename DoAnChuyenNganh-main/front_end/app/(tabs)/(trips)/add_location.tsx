import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import axiosClient from "@/lib/api/axiosClient";

// Định nghĩa type cho địa điểm
interface Location {
    _id: string;
    name: string;
    address: string;
    image?: string;
}

export default function AddLocationScreen() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [resultsSearch, setResultsSearch] = useState<Location[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        if (!search) {
            setLoading(true);
            axiosClient.get("/location2").then(res => {
                setLocations(res.data);
            }).catch(() => {
                alert("Không thể tải dữ liệu địa điểm");
            }).finally(() => setLoading(false));
        }
    }, [search]);

    const fetchAutocompleteResults = async (text: string) => {
        setSearch(text);
        if (text.length === 0) {
            setResultsSearch([]);
            return;
        }
        try {
            const res = await axiosClient.get(`/location2/search?textSearch=${encodeURIComponent(text)}`);
            setResultsSearch(res.data && Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            setResultsSearch([]);
        }
    };

    const displayLocations = search.length > 0 ? resultsSearch : locations;

    if (loading) return <ActivityIndicator />;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Thanh tìm kiếm */}
            <View style={{ padding: 20, paddingBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        style={{ flex: 1, marginLeft: 8, color: '#111' }}
                        placeholder="Tìm kiếm địa điểm..."
                        placeholderTextColor="#9CA3AF"
                        value={search}
                        onChangeText={fetchAutocompleteResults}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearch(""); setResultsSearch([]); }}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <ScrollView style={{ padding: 20, paddingTop: 10 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Chọn địa điểm để thêm</Text>
                {displayLocations.length === 0 && (
                    <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Không có địa điểm nào phù hợp.</Text>
                )}
                {displayLocations.map((loc) => (
                    <TouchableOpacity
                        key={loc._id}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", marginBottom: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
                        onPress={() => {
                            router.push({
                                pathname: "/(tabs)/(trips)/trip_details",
                                params: {
                                    ...params,
                                    time: params.time ?? "1",
                                    add_location: JSON.stringify(loc),
                                },
                            });
                        }}
                    >
                        <Image
                            source={loc.image ? { uri: loc.image } : require("../../../assets/images/bana.jpg")}
                            style={{ width: 80, height: 80, borderRadius: 12, margin: 10, backgroundColor: '#eee' }}
                            resizeMode="cover"
                        />
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>{loc.name}</Text>
                            <Text style={{ color: '#666', fontSize: 13 }}>{loc.address}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
} 