import { Text, StyleSheet, TextProps } from "react-native";

interface TitleProps extends TextProps {
  children: React.ReactNode;
}

export function Title({ children, ...props }: TitleProps) {
  return (
    <Text style={styles.title} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff0000ff",
    marginBottom: 10,
  },
});
