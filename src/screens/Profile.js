import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Card,
  Divider,
  ProgressBar,
  Button,
  Dialog,
  Portal,
  Provider,
  Text,
  IconButton,
} from "react-native-paper";
import TextInput from "../components/TextInput";
import { capitalize, phoneRegExp, plateRegExp } from "../helpers/helper";
import { View, StyleSheet, ScrollView } from "react-native";
import { theme } from "../core/theme";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { db } from "../../firebase";
import { successToast } from "../core/theme";
import { useToast } from "react-native-styled-toast";
import Loading from "../components/Loading";
import { Formik } from "formik";
const reviewSchema = yup.object({
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
  plate: yup
    .string()
    .max(8)
    .matches(plateRegExp, "License plate is not valid")
    .required()
});


export default function Profile({ route,navigation }) {
  const [user, setUser] = useState(null);
  
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  async function fetchPrivateInfo(name,email,phone,plate) {

  
    try {
      let userID;
      await AsyncStorage.getItem("@userData").then((res) => {
        userID = res ? JSON.parse(res).id : route.params.user.id;
        setUser(JSON.parse(res));
      });

      await db
        .collection("users")
        .doc(userID)
        .get()
        .then(async (snapshot) => {
          if (snapshot.exists) {
            console.log(snapshot.data());
            setUser({ ...snapshot.data(), id: userID });
          }
          console.log(user);
        })
        .catch((error) => console.log(error));
    
        await fetchUpdateAPI();
        
    } catch (error) {
      console.log(error);
    }
  }
  async function getUpdateUser(id) {
    await fetchDriverOrdersAPI(id).then((orders) => {
      setSelfOrder(
        orders.docs.map((doc) => {
          return { key: doc.id, ...doc.data() };
        })
      );
    });
  }
      

  async function refresh(name,email,phone,plate ) {
    await fetchPrivateInfo(name,email,phone,plate);
    
  }

  const  onEditPress = (form) => {
    setLoading(true);
    
         db.collection("users")
          .doc(route.params.user.id)
          .update({
            name: form.name,
            email: form.email,
            tel: form.phone,
            plate: form.plate,
          })
          .then(() => {
            toast(successToast("Update Successfully!"));
            refresh(form.name,form.email,form.phone,form.plate )
            /*navigation.replace("Dashboard", {
              id:route.params.user.id,
              email: route.params.user.email,
            });*/
            
            
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            alert(error.message);
          }).finally(()=>{
            
          });
          
  };
  useEffect(() => {
    refresh();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        
      }}
    >
      <Formik
        initialValues={{
          email: route.params.user.email,
          name: route.params.user.name,
          phone: route.params.user.tel,
          plate: route.params.user.plate,
        }}
        validationSchema={reviewSchema}
        onSubmit={(values) => onEditPress(values)}
      >
        {(props) => (
          <View style={styles.form}>
             <Card
          style={{ ...styles.card }}
          
        >
          <Card.Content style={{ marginBottom: -6 }}>
          <TextInput
              label="Email"
              value={props.values.email}
              disabled
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
              errorText={props.touched.phone && capitalize(props.errors.phone)}
              keyboardType="phone-pad"
              returnKeyType="next"
              editable={!isLoading}
            ></TextInput>
            <TextInput
              label="License Plate"
              value={props.values.plate}
              onChangeText={props.handleChange("plate")}
              error={props.touched.plate && props.errors.plate}
              errorText={props.touched.plate && capitalize(props.errors.plate)}
              returnKeyType="next"
              editable={!isLoading}
            ></TextInput>
            <Button
              style={{ marginTop: 20 ,backgroundColor: theme.colors.primary }}
              mode="contained"
              disabled={isLoading}
              onPress={props.handleSubmit}
              
            >
              Edit Account
            </Button>
          </Card.Content>
        </Card>
        
            
          </View>
        )}
      </Formik>
      {isLoading && <Loading />}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  profile: {
    backgroundColor: theme.colors.primary,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    paddingBottom: 291.5,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  card: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 20,
  },

});
