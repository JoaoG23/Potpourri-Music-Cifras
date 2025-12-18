import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assumindo que o projeto usa Expo ou tem Ionicons. Se não tiver, usarei Text.

interface FloatingScrollControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  onSubmit: () => void;
}

export const FloatingScrollControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  onSubmit,
}: FloatingScrollControlsProps) => {
  const increaseSpeed = () => {
    if (speed < 5) onSpeedChange(parseFloat((speed + 0.5).toFixed(1)));
  };

  const decreaseSpeed = () => {
    if (speed > 0.5) onSpeedChange(parseFloat((speed - 0.5).toFixed(1)));
  };

  return (
    <View style={styles.containerPosition}>
      <View style={styles.container}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.button} onPress={decreaseSpeed}>
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.speedDisplay}>
            <Text style={styles.speedText}>{speed.toFixed(1)}x</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={increaseSpeed}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.playButton,
              isPlaying && styles.stopButton,
            ]}
            onPress={onPlayPause}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.buttonSave} onPress={onSubmit}>
          <Ionicons name="save-outline" size={20} color="#f1f1f1ff" />
          {""}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSave: {
    backgroundColor: "#5856d6",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textSave: {
    color: "#f1f1f1ff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  containerPosition: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
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
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  speedDisplay: {
    width: 50,
    alignItems: "center",
  },
  speedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  playButton: {
    backgroundColor: "#5856d6",
    width: 60,
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#D65D56",
  },
});
