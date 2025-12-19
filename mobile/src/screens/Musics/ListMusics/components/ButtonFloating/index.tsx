import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ButtonAddProps {
  onPress: () => void;
}

export const ButtonFloating = ({ onPress }: ButtonAddProps) => {
  return (
    <View>
      <TouchableOpacity style={styles.buttonSave} onPress={onPress}>
        <Ionicons name="add-outline" size={20} color="#f1f1f1ff" />
        {""}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSave: {
    width: 53,
    height: 53,
    position: "absolute",
    top: 630,
    right: 30,
    zIndex: 1,
    backgroundColor: "#56d687c5",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000b7",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
