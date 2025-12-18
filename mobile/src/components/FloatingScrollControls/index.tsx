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
}

export const FloatingScrollControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
}: FloatingScrollControlsProps) => {
  const increaseSpeed = () => {
    if (speed < 5) onSpeedChange(parseFloat((speed + 0.5).toFixed(1)));
  };

  const decreaseSpeed = () => {
    if (speed > 0.5) onSpeedChange(parseFloat((speed - 0.5).toFixed(1)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.button} onPress={decreaseSpeed}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.speedDisplay}>
          <Text style={styles.speedText}>{speed.toFixed(1)}x</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={increaseSpeed}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.playButton,
            isPlaying && styles.stopButton,
          ]}
          onPress={onPlayPause}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Stop" : "Play"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    padding: 12,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
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
    backgroundColor: "#1baf6aff",
    width: 60,
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#bd3129ff",
  },
});
