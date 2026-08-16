import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface PropriedadesControlesFlutuantesVisualizacao {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (novaVelocidade: number) => void;
}

export const FloatingViewControls: React.FC<PropriedadesControlesFlutuantesVisualizacao> = ({
  isPlaying: estaExecutandoRolamento,
  onPlayPause: alternarEstadoRolamento,
  speed: velocidadeAtual,
  onSpeedChange: alterarVelocidadeRolamento,
}) => {
  const aumentarVelocidadeRolamento = () => {
    if (velocidadeAtual < 5) {
      alterarVelocidadeRolamento(parseFloat((velocidadeAtual + 0.5).toFixed(1)));
    }
  };

  const diminuirVelocidadeRolamento = () => {
    if (velocidadeAtual > 0.5) {
      alterarVelocidadeRolamento(parseFloat((velocidadeAtual - 0.5).toFixed(1)));
    }
  };

  return (
    <View style={estilos.posicaoControlesFlutuantes}>
      <View style={estilos.containerControles}>
        <View style={estilos.linhaBotoesControle}>
          <TouchableOpacity
            style={estilos.botaoControle}
            onPress={diminuirVelocidadeRolamento}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={estilos.containerExibicaoVelocidade}>
            <Text style={estilos.textoVelocidade}>
              {velocidadeAtual.toFixed(1)}x
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoControle}
            onPress={aumentarVelocidadeRolamento}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoControle,
              estilos.botaoReproducao,
              estaExecutandoRolamento && estilos.botaoPausaAtivo,
            ]}
            onPress={alternarEstadoRolamento}
            activeOpacity={0.8}
          >
            <Ionicons
              name={estaExecutandoRolamento ? "pause" : "play"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  posicaoControlesFlutuantes: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  containerControles: {
    backgroundColor: "rgba(156, 156, 156, 0.39)",
    padding: 9,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  linhaBotoesControle: {
    flexDirection: "row",
    alignItems: "center",
  },
  botaoControle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  containerExibicaoVelocidade: {
    width: 50,
    alignItems: "center",
  },
  textoVelocidade: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  botaoReproducao: {
    backgroundColor: "#5856d6",
    width: 60,
    marginLeft: 10,
  },
  botaoPausaAtivo: {
    backgroundColor: "#D65D56",
  },
});
