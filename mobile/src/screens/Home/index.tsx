import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { TNavigationScreenProps } from "../../Routes";

export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Potpourri Music</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="musical-notes" size={150} color="white" />

        <Text style={styles.description}>
          Venha usar para tocar suas cifras e criar potpourris e playlists de
          músicas!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Musicas")}
      >
        <Text style={styles.buttonText}>Ver Músicas</Text>
        <Ionicons name="arrow-forward" size={20} color="#5856D6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5856D6",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  description: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 30,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#155DFC",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});
