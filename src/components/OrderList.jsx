import React from "react";
import { Button, StyleSheet, FlatList } from "react-native";
import { Paragraph } from "react-native-paper";
import { Text } from "react-native";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
//class extends FlatList from react-native
const FlatListStyle={
	//border color
	borderColor: "#777",

	//border width
	borderWidth: 2,

	borderRadius: 10,
	padding: 8,
	margin: 10,
	flex: 1,
	flexDirection: "column",
	
}
const ParagraphCustomStyle={
	flex: 1,
	flexDirection: "row",
	justifyContent: "space-between",
	padding: 8,
}
const TextCustomStyle={
	display: "flex",
	flexDirection: "row",
	//margin y axis
	marginTop: 20,
	marginBottom: 10,
}
export default class OrderList extends FlatList {
	  //constructor
  constructor(props) {
	super(props);
	this.state = {
		user: "",
	};
	AsyncStorage.getItem("@userData").then((data) => {
		
		this.state.user = JSON.parse(data).id;
	});
	//console.log(this.state.user);
  }
  
  //render
  render() {
	//console.log(this.props);
	return (
	  <Text style={TextCustomStyle}>{this.props.label}
	  
	  <Text>Legenda:■ = Pedido em andamento,▤ = Pedido finalizado</Text>
	  <FlatList
		data={this.props.data}
		style={FlatListStyle}
		renderItem={
			({ item }) => (
				<Paragraph style={ParagraphCustomStyle}>
					<Text style={TextCustomStyle}>
						{item.key}, {item.status},{Math.round(item.distance * 10) / 10}Km
					</Text>
				{this.props.button &&
					<Button onPress={() => 
						//change assigned_order on firebase to this.props.user
						db.collection("orders").doc(item.key).update({
							assigned_driver: this.state.user,
						})
					} title={this.props.button}></Button>
				}
				</Paragraph>
			)
		}
		keyExtractor={(item) => item.key}
		ListEmptyComponent={<Text>Não existem encomendas sem condutores atribuidos</Text>}
	  />
	  </Text>
	);
  }
  
}


  