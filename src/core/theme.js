import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000000",
    primary: "#FF851B",
    secondary: "#414757",
    error: "#f13a59",
  },
};

export const successToast = (message) => {
  return {
    message: message,
    iconSize: 25,
    iconColor: "green",
    toastStyles: {
      borderRadius: 16,
      borderWidth: 0,
      borderLeftColor: "green",
      borderLeftWidth: 8,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
  };
};
