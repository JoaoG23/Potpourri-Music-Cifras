import React, { useState, useRef, useEffect } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";

import api from "../../../services/api";
import { Musica } from "../types/musicasTypes";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";
import { FloatingScrollControls } from "./components/FloatingScrollControls";
import { useAutoScroll } from "../../../hooks/useAutoScroll/useAutoScroll";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";

interface MusicaDetalhe extends Musica {
  link_musica?: string;
  cifra?: string;
  velocidade_rolamento?: number;
}

interface MusicaEdit {
  nome: string;
  artista: string;
  link_musica: string;
  cifra: string;
  velocidade_rolamento: number;
}

export const EditMusic = () => {
  const route = useRoute<any>();

  const { id } = route.params || {};
  const [isPreview, setIsPreview] = useState(true);

  const { control, handleSubmit, reset, watch } = useForm<MusicaEdit>({
    defaultValues: {
      nome: "",
      artista: "",
      link_musica: "",
      cifra: "",
      velocidade_rolamento: 1.0,
    },
  });

  const cifraWatch = watch("cifra");

  const scrollViewRef = useRef<ScrollView>(null);
  const { isPlaying, speed, setSpeed, togglePlay, handleScroll } =
    useAutoScroll(scrollViewRef);

  const {
    data: musicaData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["musica", id],
    queryFn: async () => {
      const response = await api.get(`/musicas/${id}`);
      return response;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (musicaData?.data.musica) {
      const m = musicaData.data.musica;
      reset({
        nome: m.nome,
        artista: m.artista,
        link_musica: m.link_musica || "",
        cifra: m.cifra || "",
        velocidade_rolamento: m.velocidade_rolamento || 1.0,
      });
      setSpeed(m.velocidade_rolamento || 1.0);
    }
  }, [musicaData, reset, setSpeed]);

  const { mutateAsync: editMutateMusic, isPending } = useMutation({
    mutationFn: async (musicaEdit: MusicaEdit) => {
      const response = await api.put(`/musicas/${id}`, musicaEdit);
      return response;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Música editada com sucesso!",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message,
      });
    },
  });

  const musica: MusicaDetalhe = musicaData?.data.musica || {};

  if (isLoading || isPending) {
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
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
      >
        <Title title={musica.nome} />
        <Subtitle title={musica.artista} />

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
            style={[styles.editButton, { marginLeft: 10 }]}
            onPress={() => setIsPreview(!isPreview)}
          >
            <Text style={styles.editText}>
              {isPreview ? "Editar Cifra" : "Ver Colorido"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textareaContainer}>
          {isPreview ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>{colorirCifras(cifraWatch)}</View>
            </ScrollView>
          ) : (
            <Controller
              control={control}
              name="cifra"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textarea, { minHeight: 400 }]}
                  multiline
                  placeholder="Insira a cifra aqui..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlignVertical="top"
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <FloatingScrollControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        speed={speed}
        onSpeedChange={setSpeed}
        onSubmit={handleSubmit((data) =>
          editMutateMusic({ ...data, velocidade_rolamento: speed })
        )}
      />
    </View>
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
    paddingBottom: 100, // Espaço para não cobrir o conteúdo final com o botão flutuante
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
    backgroundColor: "#fc8f36ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#5856d6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editText: {
    color: "#fff",
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
