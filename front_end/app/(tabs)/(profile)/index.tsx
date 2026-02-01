import { useEffect } from "react";
import { router } from "expo-router";

export default function RedirectToProfile() {
  useEffect(() => {
    router.replace("/(tabs)/(profile)/profile");
  }, []);
  return null;
} 