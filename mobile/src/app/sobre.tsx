import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Title } from "../components/Title";

export default function Sobre() {
  return (
    <View style={styles.container}>
      <Title>Página Sobre</Title>
      <Text style={styles.description}>
        Esta é uma nova página criada com Expo Router.
      </Text>

      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Voltar para Home</Text>
      </Link>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  link: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  linkText: {
    color: "white",
    fontSize: 16,
  },
});
