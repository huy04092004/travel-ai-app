import { Stack } from 'expo-router';

export default function TripLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen 
                name="trip" 
                options={{ 
                    title: "Tạo lịch trình",
                    headerShown: false
                }} 
            />
            <Stack.Screen 
                name="add_trip" 
                options={{ 
                    title: "Thêm lịch trình",
                    headerShown: false
                }} 
            />
            <Stack.Screen 
                name="trip_details" 
                options={{ 
                    title: "Chi tiết lịch trình",
                    headerShown: false
                }} 
            />
            <Stack.Screen 
                name="itinerary" 
                options={{ 
                    title: "Lịch trình",
                    headerShown: false
                }} 
            />
        </Stack>
    );
}
