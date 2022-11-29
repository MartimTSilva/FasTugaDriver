import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
//import  from "../components/FlatList";
import Paragraph from "../components/Paragraph";
import { StyleSheet, Text, View, Button, FlatList  } from "react-native";
import { db } from "../../firebase";
import {  onSnapshot, collection } from "firebase/firestore";
export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);
  // get orders from firbebase.js getBlankOrders()
  const [order, setOrder] = useState([]);
  //fetch orders from firebase
  

  useEffect(() => {
    try {
      AsyncStorage.getItem("@userData").then((data) => {
        db.collection("users")
          .doc(JSON.parse(data).id)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setUser(snapshot.data());
            }
          });
      });
    } catch (error) {}
  }, []);
  //use effect to fetcjh orders that have assigned_dreiver = ""
  useEffect(() => {
	db.collection("orders").where("assigned_driver", "==", "").get().then((querySnapshot) => {
	
		setOrder(querySnapshot.docs.map((doc)=>
			//return doc.data(); with doc.id
			{ return {key: doc.id, ...doc.data()}; }
		

		))

	});
  }, []);
  const onLogout = () => {
    AsyncStorage.removeItem("@userData");
    navigation.replace("Login");
  };
  //function to get distance from 2 decimal logintudes and latitudes
  const getDistance = (lat1, lon1, lat2, lon2) => {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
	  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	  Math.cos(deg2rad(lat1)) *
	    Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) *
		Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	
	return d;
	  };
	  const deg2rad = (deg) => {
		return deg * (Math.PI / 180);
	  };
  
  
  const formatedOrders = order.map((item)=>{
	//console.log of the item key
	  return {
		key: item.key,
		//key: item,
		status: item.status,
		//distancia de bangcock ate ao ponto
		distance: getDistance(item.delivery_coords.latitude, item.delivery_coords.longitude, 13.75398, 100.50144),
	  }
	    })
// 
  return (
    <View style={styles.container}>
      <Text>Hello {user?.name}!</Text>
		<OrderList data={formatedOrders} button="Assign!" label="Pedidos sem condutores atribuidos "></OrderList>
	  <Button onPress={onLogout} title="Logout"></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
