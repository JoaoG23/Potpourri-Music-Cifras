import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import { TNavigationScreenProps } from "../../Routes";
import { getArtistasStats } from "./api";

export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  const { data: artistasData } = useQuery({
    queryKey: ["artistas-stats"],
    queryFn: getArtistasStats,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Potpourri Music</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="musical-notes" size={120} color="white" />

        <Text style={styles.description}>
          Venha usar para tocar suas cifras e criar potpourris e playlists de
          musicas!
        </Text>

        {artistasData !== undefined && (
          <View style={styles.statsCard}>
            <Ionicons name="person-outline" size={22} color="#5856D6" />
            <Text style={styles.statsText}>
              <Text style={styles.statsNumber}>{artistasData.total}</Text>
              {" artista"}{artistasData.total !== 1 ? "s" : ""}{" cadastrado"}{artistasData.total !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Musicas")}
      >
        <Text style={styles.buttonText}>Ver Musicas</Text>
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
    gap: 20,
  },
  description: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statsText: {
    fontSize: 15,
    color: "#333",
  },
  statsNumber: {
    fontWeight: "bold",
    color: "#5856D6",
    fontSize: 17,
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
