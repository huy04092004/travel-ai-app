import { useEffect } from "react";
import { router } from "expo-router";

export default function RedirectToLocations() {
  useEffect(() => {
    router.replace("/(tabs)/(locations)/locations");
  }, []);
  return null;
} 