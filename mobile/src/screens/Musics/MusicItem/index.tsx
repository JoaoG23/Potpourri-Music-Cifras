import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Musica } from "../types/musicasTypes";

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

export const MusicItem = React.memo(({ item }: MusicItemProps) => (
  <View style={styles.card}>
    <View style={styles.info}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.artista}>{item.artista}</Text>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity onPress={() => console.log("Editar", item.id)}>
        <Feather name="edit" size={23} color="#5f5f5fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log("Deletar", item.id)}>
        <Feather name="trash" size={23} color="#bb4e48ff" />
      </TouchableOpacity>
    </View>
  </View>
));
