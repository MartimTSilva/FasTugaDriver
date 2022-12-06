import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import React from "react";
import * as Location from "expo-location";
import { Card, Divider, Text } from "react-native-paper";
import { theme } from "../core/theme";

export default class Maps extends React.Component {
  constructor(props) {
	super(props);

	this.state = {
		currentLocation: {},
		fastugaLocation: { latitude: 39.73447231382876, longitude: -8.821027283140435},
		deliveryLocation: { latitude: props.order.coords.lat, longitude: props.order.coords.long},
		get markers() {
			return [{coordinate: this.fastugaLocation, title:"Fastuga restaurant"}, {coordinate: this.deliveryLocation, title:"Delivery location"}]}
	};
}
  

componentDidMount () {
   ( async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
		  setErrorMsg("Permission to access location was denied");
		  return;
		}
  
		let location = await Location.getCurrentPositionAsync({});
		
		this.state.currentLocation = location.coords;
		//this.state.markers.push = {coordinate: this.state.currentLocation, title:"Current location"};
		this.state.markers.push({coordinate: this.state.currentLocation, title:"Current location"});
  	})();
	  
}
  render() {
	
	
    const order = this.props.order;
    const customer = this.props.customer;
    const GOOGLE_MAPS_APIKEY = "AIzaSyBDg9iVKHgE7xKL-JTH-Z6p8b5zs1cbGDc";
	//await until currentLocation is set

    return (
      <Card
        style={{
          marginHorizontal: 20,
          marginVertical: 14,
        }}
      >
        <Card.Title
          title="Delivery Address"
          titleStyle={{
            marginTop: -15,
            color: theme.colors.primary,
            fontSize: 17,
            paddingTop: 14,
            fontWeight: "600",
          }}
          subtitleNumberOfLines={1}
          subtitleStyle={{ color: theme.colors.secondary, fontWeight: "700" }}
        />

        <View style={{ paddingLeft: 18, paddingBottom: 8, marginTop: -12 }}>
          <Text style={styles.cardText}>{customer.name}</Text>
          <Text style={styles.cardText}>{customer.address + " • (" + order.distance + " km)"}</Text>
        </View>
        <View
          style={{
            borderBottomEndRadius: 12,
            borderBottomStartRadius: 12,
            overflow: "hidden",
          }}
        >
          <Divider />
          <MapView
            style={{
              width: "100%",
              aspectRatio: 1.1,
            }}
            initialRegion={{
              latitude: this.state.deliveryLocation.latitude,
              longitude: this.state.deliveryLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
			{this.state.markers.map((marker, index) => (
				
				 <Marker
				   key={index}
				   coordinate={marker.coordinate}
				   title={marker.title}
				/>
				
			))}
            <MapViewDirections
              origin={this.state.fastugaLocation}
              destination={this.state.deliveryLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={6}
              strokeColor={theme.colors.error}
              optimizeWaypoints={true}
            />
            
          </MapView>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardText: {
    fontWeight: "700",
    fontSize: 14.5,
    color: "#4f5d5e",
  },
});

