import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Musica } from "../../../Musics/types/musicasTypes";

interface AvailableMusicItemProps {
  item: Musica;
  onAdd: (item: Musica) => void;
  isAdded: boolean;
}

export const AvailableMusicItem = React.memo(
  ({ item, onAdd, isAdded }: AvailableMusicItemProps) => {
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.artista} numberOfLines={1}>
            {item.artista}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isAdded && styles.addedButton]}
          onPress={() => onAdd(item)}
          disabled={isAdded}
        >
          <Ionicons
            name={isAdded ? "checkmark-circle" : "add-circle"}
            size={28}
            color={isAdded ? "#8E8E93" : "#56D688"}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  artista: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    padding: 4,
  },
  addedButton: {
    opacity: 0.6,
  },
});
