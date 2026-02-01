import { useEffect } from "react";
import { router } from "expo-router";

export default function RedirectToTrip() {
  useEffect(() => {
    router.replace("/(tabs)/(trips)/trip");
  }, []);
  return null;
} 