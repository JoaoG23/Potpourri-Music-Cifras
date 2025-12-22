import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
  title: string;
  variant?: "success" | "danger" | "neutral";
};

export const Button = ({ onPress, title, variant = "success" }: Props) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "danger":
        return "#D65D56";
      case "neutral":
        return "#8E8E93";
      case "success":
      default:
        return "#56D688";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.editButton, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
    >
      <Text style={styles.editText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
});
