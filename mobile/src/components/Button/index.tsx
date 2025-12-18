import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
  title: string;
};

export const Button = ({ onPress, title }: Props) => {
  return (
    <TouchableOpacity
      style={styles.editButton}
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
    backgroundColor: "#56D688",
    padding: 12,
    borderRadius: 12,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
});
