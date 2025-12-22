import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FloatingViewControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
}

export const FloatingViewControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
}: FloatingViewControlsProps) => {
  const increaseSpeed = () => {
    if (speed < 5) onSpeedChange(parseFloat((speed + 0.5).toFixed(1)));
  };

  const decreaseSpeed = () => {
    if (speed > 0.5) onSpeedChange(parseFloat((speed - 0.5).toFixed(1)));
  };

  return (
    <View style={styles.controlsPosition}>
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={decreaseSpeed}
          >
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.speedDisplay}>
            <Text style={styles.speedText}>{speed.toFixed(1)}x</Text>
          </View>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={increaseSpeed}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
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
    </View>
  );
};

const styles = StyleSheet.create({
  controlsPosition: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  controlsContainer: {
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
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
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
