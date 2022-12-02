import { View } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React from "react";
import { Card } from "react-native-paper";
import { theme } from "../core/theme";

export default class Maps extends React.Component {
  render() {
    const orderCoords = this.props.coords;
    const customer = this.props.customer;

    return (
      <Card
        style={{
          marginHorizontal: 20,
          marginVertical: 14,
        }}
      >
        <Card.Title
          title={customer.name}
          subtitle={customer.address}
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

        <View
          style={{
            borderBottomEndRadius: 12,
            borderBottomStartRadius: 12,
            overflow: "hidden",
          }}
        >
          <MapView
            style={{
              width: "100%",
              aspectRatio: 1.1,
            }}
            initialRegion={{
              latitude: orderCoords.lat,
              longitude: orderCoords.long,
              latitudeDelta: 0.035,
              longitudeDelta: 0.035,
            }}
          >
            <Marker
              coordinate={{
                latitude: orderCoords.lat,
                longitude: orderCoords.long,
              }}
              title="Delivery Location"
            />
          </MapView>
        </View>
      </Card>
    );
  }
}
