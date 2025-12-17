import { View, StyleSheet, Text } from "react-native";
import { Title } from "../components/Title";

export default function Potpourris() {
  return (
    <View style={styles.container}>
      <Title>Potpourris</Title>
      <Text>Lista de potpourris aqui...</Text>
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
