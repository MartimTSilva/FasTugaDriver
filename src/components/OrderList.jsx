import React from "react";
import { Button, StyleSheet, FlatList } from "react-native";
import { Paragraph } from "react-native-paper";
import { Text } from "react-native";
//class extends FlatList from react-native
export default class OrderList extends FlatList {
	  //constructor
  constructor(props) {
	super(props);
	
  }

  //render
  render() {
	console.log(this.props);
	return (
	  <FlatList
		data={this.props.data}
		renderItem={
			({ item }) => (
				<Paragraph>
					<Text>
						{item.key}, {item.status},{Math.round(item.distance * 10) / 10}Km
					</Text>
				{this.props.button &&
					<Button onPress={() => console.log("welp")} title={this.props.button}></Button>
				}
				</Paragraph>
			)
		}
		keyExtractor={(item) => item.id}
	  />
	);
  }
}
