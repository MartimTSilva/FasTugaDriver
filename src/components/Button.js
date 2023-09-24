import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

export default function Button({ mode, style, disabled, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode !== "outlined" && { backgroundColor: theme.colors.primary },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      disabled={disabled}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 1,
    borderRadius: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 26,
  },
});
