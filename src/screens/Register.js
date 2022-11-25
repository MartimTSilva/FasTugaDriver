import { StyleSheet, Text, View } from "react-native";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import Logo from "../components/Logo";
import * as yup from "yup";
import { capitalize, phoneRegExp } from "../helpers/helper";
import { useState } from "react";
import Loading from "../components/Loading";
import { auth, db } from "../../firebase";
import { successToast } from "../core/theme";
import { useToast } from "react-native-styled-toast";
import Background from "../components/Background";

const reviewSchema = yup.object({
  email: yup.string().email().required(),
  name: yup
    .string()
    .min(2)
    .matches(/^[A-Za-z ]*$/, "Name is not valid")
    .required(),
  phone: yup
    .string()
    .length(9)
    .matches(phoneRegExp, "Phone number is not valid")
    .required(),
  plate: yup.string().max(8).required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .min(6)
    .equals([yup.ref("password")], "Passwords don't match"),
});

export default function Register({ navigation }) {
  const [emailError, setEmailError] = useState();
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const onRegisterPress = (form) => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(() => {
        db.collection("users")
          .doc(auth().currentUser.uid)
          .set({
            name: form.name,
            email: form.email,
            tel: form.phone,
            plate: form.plate,
          })
          .then(() => {
            toast(successToast("Registered Successfully!"));
            navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            alert(error.message);
          });
      })
      .catch((error) => {
        setLoading(false);
        if (error.code == "auth/email-already-in-use")
          setEmailError("Email already in use");
        else alert(error.message);
      });
  };

  return (
    <Background>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 30,
        }}
      >
        <Formik
          initialValues={{
            email: "",
            name: "",
            phone: "",
            plate: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={reviewSchema}
          onSubmit={(values) => onRegisterPress(values)}
        >
          {(props) => (
            <View style={styles.form}>
              <Logo />
              <TextInput
                label="Email"
                value={props.values.email}
                onChangeText={props.handleChange("email")}
                error={props.touched.email && props.errors.email && emailError}
                errorText={
                  props.touched.email &&
                  (capitalize(props.errors.email) || emailError)
                }
                autoCapitalize="none" //First char lowercase
                returnKeyType="next"
                keyboardType="email-address"
                editable={!isLoading}
              ></TextInput>
              <TextInput
                label="Name"
                value={props.values.name}
                onChangeText={props.handleChange("name")}
                error={props.touched.name && props.errors.name}
                errorText={props.touched.name && capitalize(props.errors.name)}
                returnKeyType="next"
                editable={!isLoading}
              ></TextInput>
              <TextInput
                label="Phone"
                value={props.values.phone}
                onChangeText={props.handleChange("phone")}
                error={props.touched.phone && props.errors.phone}
                errorText={
                  props.touched.phone && capitalize(props.errors.phone)
                }
                keyboardType="phone-pad"
                returnKeyType="next"
                editable={!isLoading}
              ></TextInput>
              <TextInput
                label="License Plate"
                value={props.values.plate}
                onChangeText={props.handleChange("plate")}
                error={props.touched.plate && props.errors.plate}
                errorText={
                  props.touched.plate && capitalize(props.errors.plate)
                }
                returnKeyType="next"
                editable={!isLoading}
              ></TextInput>
              <TextInput
                label="Password"
                value={props.values.password}
                onChangeText={props.handleChange("password")}
                error={props.touched.password && props.errors.password}
                errorText={
                  props.touched.password && capitalize(props.errors.password)
                }
                returnKeyType="next"
                secureTextEntry
                editable={!isLoading}
              ></TextInput>
              <TextInput
                label="Confirm Password"
                value={props.values.confirmPassword}
                onChangeText={props.handleChange("confirmPassword")}
                error={
                  props.touched.confirmPassword && props.errors.confirmPassword
                }
                errorText={
                  props.touched.confirmPassword &&
                  capitalize(props.errors.confirmPassword)
                }
                returnKeyType="done"
                secureTextEntry
                editable={!isLoading}
              ></TextInput>
              <Button
                mode="contained"
                disabled={isLoading}
                onPress={props.handleSubmit}
              >
                Create Account
              </Button>
            </View>
          )}
        </Formik>
        {isLoading && <Loading />}
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
  },
});
