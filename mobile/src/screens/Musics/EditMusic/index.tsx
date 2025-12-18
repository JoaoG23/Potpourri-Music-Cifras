import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import { Musica } from "../types/musicasTypes";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";

interface MusicaDetalhe extends Musica {
  link_musica?: string;
  cifra?: string;
  velocidade_rolamento?: number;
}

export const EditMusic = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};
  const [isPreview, setIsPreview] = useState(true);
  const [cifraText, setCifraText] = useState("");

  const {
    data: musicaData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["musica", id],
    queryFn: async () => {
      const response = await api.get(`/musicas/${id}`);
      const data = response.data.musica;
      if (data?.cifra) setCifraText(data.cifra);
      return response;
    },
    enabled: !!id,
  });

  const musica: MusicaDetalhe = musicaData?.data.musica || {};

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5856d6" />
      </View>
    );
  }

  if (isError || !musica) {
    return (
      <View style={styles.center}>
        <Text>{error?.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{musica.nome}</Text>
      <Text style={styles.artist}>{musica.artista}</Text>

      <View style={styles.buttonRow}>
        {musica.link_musica && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(musica.link_musica!)}
          >
            <Text style={styles.linkText}>Ver cifra original</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.linkButton, { marginLeft: 10 }]}
          onPress={() => setIsPreview(!isPreview)}
        >
          <Text style={styles.linkText}>
            {isPreview ? "Editar Cifra" : "Ver Colorido"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.textareaContainer}>
        {isPreview ? (
          <ScrollView horizontal>
            <View>{colorirCifras(cifraText)}</View>
          </ScrollView>
        ) : (
          <TextInput
            style={[styles.textarea, { minHeight: 400 }]}
            multiline
            placeholder="Insira a cifra aqui..."
            value={cifraText}
            onChangeText={setCifraText}
            textAlignVertical="top"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    alignItems: "flex-start",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  artist: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: "#f7f2f2ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkText: {
    color: "#5856d6",
    fontWeight: "600",
  },
  textareaContainer: {
    width: "100%",
    minHeight: 300,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
  },
  textarea: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    fontSize: 15,
    fontFamily: "monospace",
    color: "#050505",
  },
});
