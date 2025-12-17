import { View, StyleSheet, Text } from "react-native";
import { Title } from "../components/Title";

export default function Musicas() {
  return (
    <View style={styles.container}>
      <Title>Músicas</Title>
      <Text>Lista de músicas aqui...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
