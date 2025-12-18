import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Control, useController } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface Props extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  required?: boolean | string;
}

export const Input = ({
  name,
  control,
  label,
  error,
  icon,
  onBlur,
  onFocus,
  required,
  ...rest
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    field: { value, onChange, onBlur: fieldOnBlur },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    defaultValue: "",
    rules: {
      required: required === true ? "Este campo é obrigatório" : required,
    },
  });

  const errorMessage = error || fieldError?.message;
  const iconColor = errorMessage
    ? "#ff3b30"
    : isFocused
    ? "#5856d6"
    : "#8e8e93";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputGroup,
          isFocused && styles.focused,
          !!errorMessage && styles.error,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.field}
          value={value}
          onChangeText={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            fieldOnBlur();
            onBlur?.(e);
          }}
          placeholderTextColor="#c7c7cc"
          {...rest}
        />

        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons name="close-circle" size={18} color="#c7c7cc" />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 12,
    height: 52,
  },
  focused: { borderColor: "#5856d6", backgroundColor: "#fff" },
  error: { borderColor: "#D65D56", backgroundColor: "#fff" },
  icon: { marginRight: 10 },
  field: { flex: 1, fontSize: 16, color: "#1c1c1e" },
  errorText: { fontSize: 12, color: "#D65D56", marginTop: 4, marginLeft: 4 },
});
