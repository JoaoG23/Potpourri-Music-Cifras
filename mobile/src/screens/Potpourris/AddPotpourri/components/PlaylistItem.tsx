import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Musica } from "../../../Musics/types/musicasTypes";
import {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

interface PlaylistItemProps extends RenderItemParams<Musica> {
  onRemove: (id: number) => void;
}

export const PlaylistItem = ({
  item,
  drag,
  isActive,
  onRemove,
}: PlaylistItemProps) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.container,
          { backgroundColor: isActive ? "#f0f0f0" : "#fff" },
        ]}
        activeOpacity={0.9}
      >
        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
          <Feather name="menu" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.artista} numberOfLines={1}>
            {item.artista}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#D65D56" />
        </TouchableOpacity>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  dragHandle: {
    paddingRight: 12,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  artista: {
    fontSize: 13,
    color: "#8E8E93",
  },
  removeButton: {
    padding: 8,
  },
});
