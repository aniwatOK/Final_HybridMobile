import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerTitleAlign: "center" }}>
          <Stack.Screen name="index" options={{ title: "HOME" }} />
          <Stack.Screen name="members" options={{ title: "สมาชิกในชั้นปี" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
