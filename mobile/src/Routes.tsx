import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Home } from "./screens/Home";
import { Musics } from "./screens/Musics/ListMusics";
import { EditMusic } from "./screens/Musics/EditMusic";
import {
  Potpourris,
  RemovePotpourri,
  ViewPotpourri,
} from "./screens/Potpourris";

import { AddMusic } from "./screens/Musics/AddMusic";

import { RemoveMusic } from "./screens/Musics/RemoveMusic";

type TScreenDefinition = {
  Main: undefined;
  Home: undefined;
  Musicas: undefined;
  Potpourris: undefined;
  EditMusic: { id: number };
  AddMusic: undefined;
  RemoveMusic: { id: number; nome: string };
  RemovePotpourri: { id: number; nome: string };
  ViewPotpourri: { id: number; nome: string };
};

const Tab = createBottomTabNavigator<TScreenDefinition>();
const Stack = createNativeStackNavigator<TScreenDefinition>();

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
        headerTintColor: "#5856D6",
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
            headerTintColor: "#5856D6",
          }}
        />
        <Stack.Screen
          name="AddMusic"
          component={AddMusic}
          options={{
            headerShown: true,
            title: "Adicionar Música",
            headerTintColor: "#5856D6",
          }}
        />
        <Stack.Screen
          name="RemoveMusic"
          component={RemoveMusic}
          options={{
            headerShown: false,
            title: "Remover Música",
            headerTintColor: "#5856D6",
          }}
        />
        <Stack.Screen
          name="RemovePotpourri"
          component={RemovePotpourri}
          options={{
            headerShown: false,
            title: "Remover Potpourri",
            headerTintColor: "#5856D6",
          }}
        />
        <Stack.Screen
          name="ViewPotpourri"
          component={ViewPotpourri}
          options={{
            headerShown: true,
            title: "Visualizar Potpourri",
            headerTintColor: "#5856D6",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type TNavigationScreenProps =
  NativeStackNavigationProp<TScreenDefinition>;
