import React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../core/theme";

export default function Loading(props) {
  return (
    <ActivityIndicator
      style={styles.loading}
      size="large"
      color={theme.colors.primary}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF88",
  },
});
