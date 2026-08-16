import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MusicaPotpourriItem } from "../../../types/potpourriTypes";

export interface PropriedadesRastreadorMusicaFlutuante {
  listaMusicasPotpourri: MusicaPotpourriItem[];
  indiceMusicaAtual: number;
  velocidadeAtual: number;
  aoSelecionarMusica: (indiceMusicaDestino: number) => void;
}

export const FloatingMusicTracker: React.FC<PropriedadesRastreadorMusicaFlutuante> = ({
  listaMusicasPotpourri,
  indiceMusicaAtual,
  velocidadeAtual,
  aoSelecionarMusica,
}) => {
  const [estaModalPlaylistAberto, setEstaModalPlaylistAberto] =
    useState<boolean>(false);

  if (!listaMusicasPotpourri || listaMusicasPotpourri.length === 0) {
    return null;
  }

  const totalMusicasPotpourri = listaMusicasPotpourri.length;
  const informacoesMusicaAtual =
    listaMusicasPotpourri[indiceMusicaAtual] || listaMusicasPotpourri[0];
  const numeroMusicaAtual = indiceMusicaAtual + 1;
  const percentualProgressoPotpourri = Math.round(
    (numeroMusicaAtual / totalMusicasPotpourri) * 100
  );

  const executarNavegacaoMusicaAnterior = () => {
    if (indiceMusicaAtual > 0) {
      aoSelecionarMusica(indiceMusicaAtual - 1);
    }
  };

  const executarNavegacaoProximaMusica = () => {
    if (indiceMusicaAtual < totalMusicasPotpourri - 1) {
      aoSelecionarMusica(indiceMusicaAtual + 1);
    }
  };

  const selecionarItemPlaylistModal = (indiceEscolhido: number) => {
    aoSelecionarMusica(indiceEscolhido);
    setEstaModalPlaylistAberto(false);
  };

  return (
    <>
      <View style={estilos.containerFlutuante} pointerEvents="box-none">
        <View style={estilos.cartaoPrincipal}>
          {/* Linha Principal de Informações e Botões */}
          <View style={estilos.linhaPrincipal}>
            {/* Badge com Número da Faixa Atual */}
            <TouchableOpacity
              style={estilos.containerBadgeIcone}
              onPress={() => setEstaModalPlaylistAberto(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="musical-notes" size={18} color="#fff" />
              <View style={estilos.containerNumeroBadge}>
                <Text style={estilos.textoNumeroBadge}>{numeroMusicaAtual}</Text>
              </View>
            </TouchableOpacity>

            {/* Informações da Música Atual */}
            <TouchableOpacity
              style={estilos.containerInformacoesMusica}
              onPress={() => setEstaModalPlaylistAberto(true)}
              activeOpacity={0.8}
            >
              <View style={estilos.linhaMetaInformacoes}>
                <Text style={estilos.textoOrdemMusica}>
                  MÚSICA {numeroMusicaAtual} DE {totalMusicasPotpourri}
                </Text>
                <View style={estilos.tagVelocidade}>
                  <Ionicons name="speedometer-outline" size={11} color="#5856d6" />
                  <Text style={estilos.textoTagVelocidade}>
                    {velocidadeAtual ? `${velocidadeAtual.toFixed(1)}x` : "1.0x"}
                  </Text>
                </View>
              </View>
              <Text
                style={estilos.tituloMusica}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {informacoesMusicaAtual?.musica?.nome || "Música"}
              </Text>
              <Text
                style={estilos.artistaMusica}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {informacoesMusicaAtual?.musica?.artista || ""}
              </Text>
            </TouchableOpacity>

            {/* Botões de Ação e Navegação */}
            <View style={estilos.containerBotoesAcao}>
              <TouchableOpacity
                style={[
                  estilos.botaoNavegacao,
                  indiceMusicaAtual <= 0 && estilos.botaoNavegacaoDesabilitado,
                ]}
                onPress={executarNavegacaoMusicaAnterior}
                disabled={indiceMusicaAtual <= 0}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-up"
                  size={18}
                  color={indiceMusicaAtual <= 0 ? "#bbb" : "#333"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  estilos.botaoNavegacao,
                  indiceMusicaAtual >= totalMusicasPotpourri - 1 &&
                    estilos.botaoNavegacaoDesabilitado,
                ]}
                onPress={executarNavegacaoProximaMusica}
                disabled={indiceMusicaAtual >= totalMusicasPotpourri - 1}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={
                    indiceMusicaAtual >= totalMusicasPotpourri - 1 ? "#bbb" : "#333"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilos.botaoNavegacao, estilos.botaoAbrirListaPlaylist]}
                onPress={() => setEstaModalPlaylistAberto(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="list" size={18} color="#5856d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Barra de Progresso do Potpourri */}
          <View style={estilos.containerBarraProgresso}>
            <View
              style={[
                estilos.preenchimentoBarraProgresso,
                { width: `${percentualProgressoPotpourri}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Modal da Playlist de Músicas */}
      <Modal
        visible={estaModalPlaylistAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setEstaModalPlaylistAberto(false)}
      >
        <View style={estilos.sobreposicaoModal}>
          <TouchableOpacity
            style={estilos.toqueFundoModal}
            activeOpacity={1}
            onPress={() => setEstaModalPlaylistAberto(false)}
          />
          <View style={estilos.conteudoModal}>
            {/* Cabeçalho do Modal */}
            <View style={estilos.cabecalhoModal}>
              <View style={estilos.linhaTituloModal}>
                <Ionicons name="list" size={20} color="#5856d6" />
                <Text style={estilos.tituloModal}>
                  Músicas do Potpourri ({totalMusicasPotpourri})
                </Text>
              </View>
              <TouchableOpacity
                style={estilos.botaoFecharModal}
                onPress={() => setEstaModalPlaylistAberto(false)}
              >
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Listagem de Músicas */}
            <FlatList
              data={listaMusicasPotpourri}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              renderItem={({ item, index }) => {
                const ehMusicaAtiva = index === indiceMusicaAtual;
                const velocidadeMusica = item.musica.velocidade_rolamento || 1.0;

                return (
                  <TouchableOpacity
                    style={[
                      estilos.itemListaModal,
                      ehMusicaAtiva && estilos.itemListaModalAtivo,
                    ]}
                    onPress={() => selecionarItemPlaylistModal(index)}
                    activeOpacity={0.7}
                  >
                    <View style={estilos.ladoEsquerdoItemLista}>
                      <Text
                        style={[
                          estilos.textoIndiceLista,
                          ehMusicaAtiva && estilos.textoIndiceListaAtivo,
                        ]}
                      >
                        {index + 1}.
                      </Text>
                      <View style={estilos.containerTextosItemLista}>
                        <Text
                          style={[
                            estilos.nomeMusicaLista,
                            ehMusicaAtiva && estilos.nomeMusicaListaAtivo,
                          ]}
                          numberOfLines={1}
                        >
                          {item.musica.nome}
                        </Text>
                        <Text
                          style={[
                            estilos.artistaMusicaLista,
                            ehMusicaAtiva && estilos.artistaMusicaListaAtivo,
                          ]}
                          numberOfLines={1}
                        >
                          {item.musica.artista}
                        </Text>
                      </View>
                    </View>

                    <View style={estilos.ladoDireitoItemLista}>
                      <View style={estilos.badgeVelocidadeLista}>
                        <Text style={estilos.textoBadgeVelocidadeLista}>
                          {velocidadeMusica}x
                        </Text>
                      </View>
                      {ehMusicaAtiva && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#5856d6"
                          style={{ marginLeft: 6 }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  containerFlutuante: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 16,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  cartaoPrincipal: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderWidth: 1,
    opacity: 0.65,
    borderColor: "rgba(0, 0, 0, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  linhaPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  containerBadgeIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#5856d6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginRight: 10,
  },
  containerNumeroBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#f59e0b",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  textoNumeroBadge: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  containerInformacoesMusica: {
    flex: 1,
    marginRight: 6,
  },
  linhaMetaInformacoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  textoOrdemMusica: {
    fontSize: 10,
    fontWeight: "700",
    color: "#5856d6",
    letterSpacing: 0.5,
  },
  tagVelocidade: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    gap: 2,
  },
  textoTagVelocidade: {
    fontSize: 9,
    fontWeight: "600",
    color: "#5856d6",
  },
  tituloMusica: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1f2937",
  },
  artistaMusica: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  containerBotoesAcao: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 6,
    gap: 2,
  },
  botaoNavegacao: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  botaoNavegacaoDesabilitado: {
    opacity: 0.4,
  },
  botaoAbrirListaPlaylist: {
    backgroundColor: "#eff1fe",
  },
  containerBarraProgresso: {
    height: 3,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  preenchimentoBarraProgresso: {
    height: "100%",
    backgroundColor: "#5856d6",
    borderRadius: 2,
  },

  // Estilos do Modal
  sobreposicaoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  toqueFundoModal: {
    ...StyleSheet.absoluteFillObject,
  },
  conteudoModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    maxHeight: "75%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cabecalhoModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
    marginBottom: 8,
  },
  linhaTituloModal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tituloModal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f2937",
  },
  botaoFecharModal: {
    padding: 4,
  },
  itemListaModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 3,
  },
  itemListaModalAtivo: {
    backgroundColor: "#eff1fe",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  ladoEsquerdoItemLista: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  textoIndiceLista: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9ca3af",
    width: 22,
  },
  textoIndiceListaAtivo: {
    color: "#5856d6",
    fontWeight: "800",
  },
  containerTextosItemLista: {
    flex: 1,
  },
  nomeMusicaLista: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  nomeMusicaListaAtivo: {
    color: "#3730a3",
    fontWeight: "bold",
  },
  artistaMusicaLista: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  artistaMusicaListaAtivo: {
    color: "#4f46e5",
  },
  ladoDireitoItemLista: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeVelocidadeLista: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  textoBadgeVelocidadeLista: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "600",
  },
});
