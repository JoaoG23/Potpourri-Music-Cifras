import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export const EditMusic = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Música</Text>
      <Text style={styles.text}>ID clicado: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
  },
});
