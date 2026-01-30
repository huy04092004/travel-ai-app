import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Location {
    _id: string;
    name: string;
    address: string;
    image?: string;
}

export default function FavoriteLocationsScreen() {
    const [favorites, setFavorites] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            } else {
                setFavorites([]);
            }
        } catch (error) {
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (name: string) => {
        const newFavorites = favorites.filter(item => item.name !== name);
        setFavorites(newFavorites);
        await AsyncStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
    };

    if (loading) return <ActivityIndicator />;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={28} color="#3B82F6" />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Địa điểm yêu thích</Text>
            </View>
            <ScrollView style={{ padding: 20, paddingTop: 0 }}>
                {favorites.length === 0 && (
                    <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Chưa có địa điểm yêu thích nào.</Text>
                )}
                {favorites.map((loc) => (
                    <View
                        key={loc._id || loc.name}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", marginBottom: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
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
                        <TouchableOpacity onPress={() => removeFavorite(loc.name)} style={{ padding: 10 }}>
                            <Ionicons name="trash" size={22} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
} 