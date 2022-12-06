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
		currentLocation: { coords: {latitude: 0, longitude: 0}}
	};
}



  render() {
	(async () => {
			console.log("Getting location");
		  let { status } = await Location.requestForegroundPermissionsAsync();
		  if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		  }
	
		  let location = await Location.getCurrentPositionAsync({});
		  
		  this.state.currentLocation = location;
		  console.log("Location: ", location)
	})();
	console.log("Current location: ", this.state.currentLocation);
    const orderCoords = this.props.order.coords;
    const order = this.props.order;
    const customer = this.props.customer;

    const origin = {
      latitude: 39.73447231382876,
      longitude: -8.821027283140435,
    };
    const destination = {
      latitude: orderCoords.lat,
      longitude: orderCoords.long,
    };
    const GOOGLE_MAPS_APIKEY = "AIzaSyBDg9iVKHgE7xKL-JTH-Z6p8b5zs1cbGDc";

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
              latitude: orderCoords.lat,
              longitude: orderCoords.long,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={6}
              strokeColor={theme.colors.error}
              optimizeWaypoints={true}
              // onReady={(result) =>
              //   console.log(
              //     "TESTE: ",
              //     result.distance + "km - " + result.duration
              //   )
              // }
            />
            <Marker
              coordinate={{
                latitude: orderCoords.lat,
                longitude: orderCoords.long,
              }}
              title="Delivery Location"
            />
		    {
				//check if currentLocation is not null
				this.state.currentLocation.coords.latitude != 0 && this.state.currentLocation.coords.longitude != 0 &&
				<Marker
			  coordinate={{
				latitude: this.state.currentLocation.coords.latitude,
				longitude: this.state.currentLocation.coords.longitude,
			  }}
			  title="Your Location"
			/>}

            <Marker
              coordinate={{
                latitude: 39.73447231382876,
                longitude: -8.821027283140435,
              }}
              title="FasTuga Restaurant"
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

