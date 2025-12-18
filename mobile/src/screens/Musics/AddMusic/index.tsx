import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import React from "react";

import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button";

import api from "../../../services/api";
import { TNavigationScreenProps } from "../../../Routes";

interface MusicSaved {
  link_musica: string;
}

export const AddMusic = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { control, handleSubmit } = useForm<MusicSaved>({
    defaultValues: {
      link_musica: "",
    },
  });

  const { mutateAsync: saveMusic, isPending } = useMutation({
    mutationFn: async (musicSaved: MusicSaved) => {
      const response = await api.post(`/musicas`, musicSaved);
      return response;
    },
    onSuccess: (response) => {
      const musica = response.data.musica;
      const { id } = musica;
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Música salva com sucesso!",
      });

      if (id) {
        navigation.navigate("EditMusic", { id: id });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Houve um erro",
        text2: error?.response?.data?.message || "Erro ao salvar a música",
      });
    },
  });

  const onSubmit = (data: MusicSaved) => {
    saveMusic(data);
  };

  return (
    <View style={styles.container}>
      <Title title="Nova Musica" />
      <Subtitle title="Link da Musica" />
      <Input
        name="link_musica"
        control={control}
        required="O link da música é obrigatório"
        placeholder="Digite ou cole o link da cifra aqui"
      />
      {isPending ? (
        <ActivityIndicator size="large" color="#5856D6" />
      ) : (
        <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
});
