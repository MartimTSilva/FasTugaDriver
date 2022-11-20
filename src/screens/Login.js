import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { database } from "../data/database";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  function emailHandler(enteredText) {
    setEmail({ value: enteredText, error: "" });
    setPassword({ ...password, error: "" });
  }

  function passwordHandler(enteredText) {
    setPassword({ value: enteredText, error: "" });
    setEmail({ ...email, error: "" });
  }

  const onLoginPressed = () => {
    console.log('TESTE:', !!email.error, !email.error, email.error);
    //Validate email + password fields
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    //Show field errors if exists
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    const user = database.findUserByEmail(email.value);
    if (!user || user.password != password.value) {
      setEmail({ ...email, error: "Invalid credentials" });
      setPassword({ ...password, error: "Invalid credentials" });
      return;
    }

    //No field erros, then go to dashboard
    navigation.replace("Dashboard");
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
      />
      <TextInput
        label="Password"
        value={password.value}
        onChangeText={passwordHandler}
        error={password.error}
        errorText={password.error}
        returnKeyType="done"
        secureTextEntry //obscures the password entered ***
      />
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push("Register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
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
});
