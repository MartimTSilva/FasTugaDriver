import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
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
	onSnapshot(collection(db, "orders"), (snapshot)=>{
	
		setOrder(snapshot.docs.map((doc)=>doc.data()))

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
  console.log(order[0].delivery_coords)
  
  const formatedOrders = order.map((item)=>{
	  return {
		key: item.id,
		status: item.status,
		//distancia de bangcock ate ao ponto
		distance: getDistance(item.delivery_coords.latitude, item.delivery_coords.longitude, 13.75398, 100.50144),
	  }
	    })
// 

  return (
    <View style={styles.container}>
      <Text>Hello {user?.name}!</Text>
	  <FlatList
        data={formatedOrders}
        renderItem={({item}) => <Text style={styles.item}>{item.key}, {item.status},{
			//round to the first decimal 
			Math.round(item.distance * 10) / 10}Km</Text>}
      />
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
