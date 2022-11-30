import AsyncStorage from "@react-native-async-storage/async-storage";
import React from 'react';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
//import  from "../components/FlatList";
import Paragraph from "../components/Paragraph";
import { RefreshControl, SafeAreaView, ScrollView,StyleSheet, Text, View, Button, FlatList  } from "react-native";
import { db } from "../../firebase";
import {  onSnapshot, collection } from "firebase/firestore";

export default function Dashboard({ navigation }) {
  const [user, setUser] = useState(null);
  // get orders from firbebase.js getBlankOrders()
  const [order, setOrder] = useState([]);

  const [selfOrder, setSelfOrder] = useState([]);
  //fetch orders from firebase
  const [refreshing, setRefreshing] = React.useState(false);
  //on drag down refresh page
  function fetchPrivateInfo() {
	try {
		AsyncStorage.getItem("@userData").then((data) => {
		  db.collection("users")
			.doc(JSON.parse(data).id)
			.get()
			.then((snapshot) => {
			  if (snapshot.exists) {
				setUser(snapshot.data());
			  }
			  
			  db.collection("orders").where("assigned_driver", "==", snapshot.id).get().then((querySnapshot) => {
				  setSelfOrder(querySnapshot.docs.map((doc)=>
					  //return doc.data(); with doc.id
					  { return {key: doc.id, ...doc.data()}; }
				  ))
			  })
			});
		});
	  } catch (error) {}
	
	}
	function fetchUnassignedOrders() {
		db.collection("orders").where("assigned_driver", "==", "").get().then((querySnapshot) => {
	
			setOrder(querySnapshot.docs.map((doc)=>
				//return doc.data(); with doc.id
				{ return {key: doc.id, ...doc.data()}; }
			))
	
		});
	}
	function refresh() {
		fetchPrivateInfo();
		fetchUnassignedOrders();
	}
  useEffect(() => {
  	refresh();
}, []);
  //use effect to fetcjh orders that have assigned_dreiver = ""

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
  
	

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		[order, setOrder] = useState([]);
	

		wait(2000).then(() => setRefreshing(false));
	}, []);
	const wait = (timeout) => {
		return new Promise(resolve => setTimeout(resolve, timeout));
	  }
	

	  
	function formatOrders(orderList){
		function replaceWithIcons(p){
			switch (p) {
				case 5:
					return "△";
				case 4:
					return "□";

				case 3:
					return "■";
				
				case 2:
					return "○";
					
				default:
					return "◉";
			}
		}
		return orderList.map((item)=>{
			return {
			key: item.key,
			status: replaceWithIcons(item.status),
			//distance to fastuga restaurant
			distance: getDistance(item.delivery_coords.latitude, item.delivery_coords.longitude,39.73447231382876, -8.821027283140435),
			}
		})
	}
// <ScrollView keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}><SafeAreaView> </ScrollView></SafeAreaView>
    
		
	
  return (
    <SafeAreaView style={styles.container}>
	  		<Text>Hello {user?.name}!</Text>
			<OrderList data={formatOrders(order)} button="Assign!" label="Pedidos sem condutores atribuidos" updateCallback={refresh}></OrderList>
			<OrderList data={formatOrders(selfOrder)} label="Pedidos atribuidos a ti" updateCallback={refresh}></OrderList>
			<Button onPress={onLogout} title="Logout"></Button>
			<StatusBar style="auto" />
			</SafeAreaView>
	 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
