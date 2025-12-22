import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Musica } from "../types/musicasTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface MusicItemProps {
  item: Musica;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: { flex: 1 },
  nome: { fontSize: 16, fontWeight: "bold" },
  artista: { fontSize: 14, color: "#666" },
  actions: { flexDirection: "row", gap: 17 },
});

// type TNativeStackNavigationProp = NativeStackNavigationProp<
//   Record<string, any>
// >;
import { TNavigationScreenProps } from "../../../Routes";

export const MusicItem = React.memo(({ item }: MusicItemProps) => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.info}
        onPress={() => navigation.navigate("EditMusic", { id: item.id })}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.artista}>{item.artista}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RemoveMusic", { id: item.id, nome: item.nome })
          }
        >
          <Feather name="trash" size={23} color="#5F5F81" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
