import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Potpourri } from "../types/potpourriTypes";
import { TNavigationScreenProps } from "../../../Routes";

interface PotpourriItemProps {
  item: Potpourri;
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
  actions: { flexDirection: "row", gap: 17 },
});

export const PotpourriItem = React.memo(({ item }: PotpourriItemProps) => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.info}
        onPress={() =>
          navigation.navigate("ViewPotpourri", {
            id: item.id,
            nome: item.nome_potpourri,
          })
        }
      >
        <Text style={styles.nome}>{item.nome_potpourri}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RemovePotpourri", {
              id: item.id,
              nome: item.nome_potpourri,
            })
          }
        >
          <Feather name="trash" size={23} color="#5F5F81" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
