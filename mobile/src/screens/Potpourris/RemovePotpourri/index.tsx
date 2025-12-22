import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { Button } from "../../../components/Button";
import { TNavigationScreenProps } from "../../../Routes";

export const RemovePotpourri = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const { id, nome } = route.params || {};

  const { mutate: deletePotpourri, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/potpourri/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potpourris"] });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Potpourri removido com sucesso!",
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error?.response?.data?.message || "Erro ao remover o potpourri",
      });
    },
  });

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Title title="Remover Potpourri" />
      <Subtitle
        title={`Tem certeza que deseja remover o potpourri "${nome}"?`}
      />

      <View style={styles.buttonContainer}>
        {isPending ? (
          <ActivityIndicator size="large" color="#D65D56" />
        ) : (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                title="Confirmar Remoção"
                variant="danger"
                onPress={() => deletePotpourri()}
              />
            </View>
            <View style={[styles.buttonWrapper, { marginTop: 10 }]}>
              <Button
                title="Desistir"
                variant="neutral"
                onPress={handleCancel}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
  },
  buttonWrapper: {
    width: "100%",
  },
});
