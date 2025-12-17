import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#eeeeeeff",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          marginBottom: 45,
          shadowColor: "#919191ff",
        //   shadowOffset: {
        //     width: 0,
        //     height: 2,
        //   },
          shadowOpacity: 0.1,
          elevation: 1,
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="musicas"
        options={{
          title: "Músicas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="potpourris"
        options={{
          title: "Potpourris",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />

      {/* Ocultando a rota "sobre" da barra de navegação, mas mantendo-a acessível */}
      <Tabs.Screen
        name="sobre"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
