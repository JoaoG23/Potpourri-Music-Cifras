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

export interface FloatingMusicTrackerProps {
  listaMusicasPotpourri: MusicaPotpourriItem[];
  indiceMusicaAtual: number;
  velocidadeAtual: number;
  aoSelecionarMusica: (indiceMusicaDestino: number) => void;
}

export const FloatingMusicTracker: React.FC<FloatingMusicTrackerProps> = ({
  listaMusicasPotpourri,
  indiceMusicaAtual,
  velocidadeAtual,
  aoSelecionarMusica,
}) => {
  const [estaModalAberto, setEstaModalAberto] = useState<boolean>(false);

  if (!listaMusicasPotpourri || listaMusicasPotpourri.length === 0) {
    return null;
  }

  const totalMusicas = listaMusicasPotpourri.length;
  const musicaAtual =
    listaMusicasPotpourri[indiceMusicaAtual] || listaMusicasPotpourri[0];
  const numeroMusicaAtual = indiceMusicaAtual + 1;
  const percentualProgresso = Math.round(
    (numeroMusicaAtual / totalMusicas) * 100
  );

  const irParaMusicaAnterior = () => {
    if (indiceMusicaAtual > 0) {
      aoSelecionarMusica(indiceMusicaAtual - 1);
    }
  };

  const irParaProximaMusica = () => {
    if (indiceMusicaAtual < totalMusicas - 1) {
      aoSelecionarMusica(indiceMusicaAtual + 1);
    }
  };

  const handleSelecionarItemLista = (indice: number) => {
    aoSelecionarMusica(indice);
    setEstaModalAberto(false);
  };

  return (
    <>
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <View style={styles.card}>
          {/* Top part with details & controls */}
          <View style={styles.mainRow}>
            {/* Music Badge with current index */}
            <TouchableOpacity
              style={styles.badgeContainer}
              onPress={() => setEstaModalAberto(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="musical-notes" size={18} color="#fff" />
              <View style={styles.badgeNumberContainer}>
                <Text style={styles.badgeNumberText}>{numeroMusicaAtual}</Text>
              </View>
            </TouchableOpacity>

            {/* Song Info */}
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => setEstaModalAberto(true)}
              activeOpacity={0.8}
            >
              <View style={styles.metaRow}>
                <Text style={styles.metaOrderText}>
                  MÚSICA {numeroMusicaAtual} DE {totalMusicas}
                </Text>
                <View style={styles.speedTag}>
                  <Ionicons name="speedometer-outline" size={11} color="#5856d6" />
                  <Text style={styles.speedTagText}>
                    {velocidadeAtual ? `${velocidadeAtual.toFixed(1)}x` : "1.0x"}
                  </Text>
                </View>
              </View>
              <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">
                {musicaAtual?.musica?.nome || "Música"}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">
                {musicaAtual?.musica?.artista || ""}
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  indiceMusicaAtual <= 0 && styles.navButtonDisabled,
                ]}
                onPress={irParaMusicaAnterior}
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
                  styles.navButton,
                  indiceMusicaAtual >= totalMusicas - 1 && styles.navButtonDisabled,
                ]}
                onPress={irParaProximaMusica}
                disabled={indiceMusicaAtual >= totalMusicas - 1}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={indiceMusicaAtual >= totalMusicas - 1 ? "#bbb" : "#333"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.listButton]}
                onPress={() => setEstaModalAberto(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="list" size={18} color="#5856d6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarFill, { width: `${percentualProgresso}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Modal Playlist List */}
      <Modal
        visible={estaModalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setEstaModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdropTouch}
            activeOpacity={1}
            onPress={() => setEstaModalAberto(false)}
          />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="list" size={20} color="#5856d6" />
                <Text style={styles.modalTitle}>
                  Músicas do Potpourri ({totalMusicas})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setEstaModalAberto(false)}
              >
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* List of Songs */}
            <FlatList
              data={listaMusicasPotpourri}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              renderItem={({ item, index }) => {
                const ehAtiva = index === indiceMusicaAtual;
                const vel = item.musica.velocidade_rolamento || 1.0;

                return (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      ehAtiva && styles.listItemActive,
                    ]}
                    onPress={() => handleSelecionarItemLista(index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.listItemLeft}>
                      <Text
                        style={[
                          styles.listIndexText,
                          ehAtiva && styles.listIndexTextActive,
                        ]}
                      >
                        {index + 1}.
                      </Text>
                      <View style={styles.listItemTextContainer}>
                        <Text
                          style={[
                            styles.listItemName,
                            ehAtiva && styles.listItemNameActive,
                          ]}
                          numberOfLines={1}
                        >
                          {item.musica.nome}
                        </Text>
                        <Text
                          style={[
                            styles.listItemArtist,
                            ehAtiva && styles.listItemArtistActive,
                          ]}
                          numberOfLines={1}
                        >
                          {item.musica.artista}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.listItemRight}>
                      <View style={styles.listSpeedBadge}>
                        <Text style={styles.listSpeedBadgeText}>{vel}x</Text>
                      </View>
                      {ehAtiva && (
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

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 16,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderWidth: 1,
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
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#5856d6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginRight: 10,
  },
  badgeNumberContainer: {
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
  badgeNumberText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    marginRight: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  metaOrderText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#5856d6",
    letterSpacing: 0.5,
  },
  speedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    gap: 2,
  },
  speedTagText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#5856d6",
  },
  songTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1f2937",
  },
  songArtist: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 6,
    gap: 2,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  listButton: {
    backgroundColor: "#eff1fe",
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#5856d6",
    borderRadius: 2,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalBackdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
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
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
    marginBottom: 8,
  },
  modalHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f2937",
  },
  modalCloseButton: {
    padding: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 3,
  },
  listItemActive: {
    backgroundColor: "#eff1fe",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  listIndexText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9ca3af",
    width: 22,
  },
  listIndexTextActive: {
    color: "#5856d6",
    fontWeight: "800",
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  listItemNameActive: {
    color: "#3730a3",
    fontWeight: "bold",
  },
  listItemArtist: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  listItemArtistActive: {
    color: "#4f46e5",
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  listSpeedBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  listSpeedBadgeText: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "600",
  },
});
