import { Text, StyleSheet } from "react-native";

type Props = {
  title: string;
};

export const Subtitle = ({ title }: Props) => {
  return <Text style={styles.subtitle}>{title}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: "#666666ff",
    marginBottom: 20,
  },
});
