import React from "react";
import { Button, StyleSheet, FlatList,RefreshControl } from "react-native";
import { Paragraph } from "react-native-paper";
import { Text } from "react-native";
import { db, ref } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
//class extends FlatList from react-native
const FlatListStyle={
	borderColor: "#777",
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
	  <Text>Legenda:◉- A preparar,○- Pronto para pickup,■- A entregar,□- Entregue ao cliente,△- Problema na entrega</Text>
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
						})/*TODO: update list too without.then(() => {
							ref.once('value')
    

						}).then(() => {
							snapshot => snapshot.val()})

						*/}title={this.props.button}></Button>
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


  