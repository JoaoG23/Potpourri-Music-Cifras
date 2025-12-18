import { Home } from "./screens/Home";
import { Musics } from "./screens/Musics";
import { EditMusic } from "./screens/Musics/EditMusic";
import { Potpourris } from "./screens/Potpourris";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<
  string,
  {
    focused: keyof typeof Ionicons.glyphMap;
    outline: keyof typeof Ionicons.glyphMap;
  }
> = {
  Home: { focused: "home", outline: "home-outline" },
  Musicas: { focused: "musical-notes", outline: "musical-notes-outline" },
  Potpourris: { focused: "albums", outline: "albums-outline" },
};

const TabRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName="Musicas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          if (!icons)
            return <Ionicons name="alert-circle" size={size} color={color} />;
          return (
            <Ionicons
              name={focused ? icons.focused : icons.outline}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#5856d6",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Musicas" component={Musics} />
      <Tab.Screen name="Potpourris" component={Potpourris} />
    </Tab.Navigator>
  );
};

export const AppRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabRoutes} />
        <Stack.Screen
          name="EditMusic"
          component={EditMusic}
          options={{
            headerShown: true,
            title: "Editar Música",
            headerTintColor: "#5856d6",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
