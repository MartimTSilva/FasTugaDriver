import { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { auth } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setLoading] = useState(false);

  function emailHandler(enteredText) {
    setEmail({ value: enteredText, error: "" });
    setPassword({ ...password, error: "" });
  }

  function passwordHandler(enteredText) {
    setPassword({ value: enteredText, error: "" });
    setEmail({ ...email, error: "" });
  }

  const onLoginPressed = () => {
    setLoading(true);

    //Validate email + password fields
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    //Show field errors if exists
    if (emailError || passwordError) {
      setLoading(false);
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userData) => {
        AsyncStorage.setItem(
          "@userData",
          JSON.stringify({ id: userData.user.uid, email: userData.user.email })
        );
        navigation.replace("Dashboard");
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.code == "auth/wrong-password" ||
          error.code == "auth/user-not-found"
        ) {
          setEmail({ ...email, error: "Invalid credentials" });
          setPassword({ ...password, error: "Invalid credentials" });
          return;
        }
      });
  };

  return (
    <Background>
      <Logo />
      <TextInput
        label="Email"
        value={email.value}
        onChangeText={emailHandler}
        error={email.error}
        errorText={email.error}
        autoCapitalize="none" //First char lowercase
        keyboardType="email-address"
        returnKeyType="next"
        editable={!isLoading}
      />
      <TextInput
        label="Password"
        value={password.value}
        onChangeText={passwordHandler}
        error={password.error}
        errorText={password.error}
        returnKeyType="done"
        secureTextEntry //obscures the password entered ***
        editable={!isLoading}
      />
      <Button mode="contained" onPress={onLoginPressed} disabled={isLoading}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={theme.colors.primary}
        />
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 50,
  },

  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },

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
