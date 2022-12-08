import React from "react";
import { View } from "react-native";
import { Button, IconButton, List, Text } from "react-native-paper";
import { theme } from "../core/theme";

import {
  PREPARING,
  DELIVERED,
  DELIVERING,
  DELIVERY_PROBLEM,
  formatOrders,
  getOrderStatusText,
  updateOrderAPI,
} from "../stores/orders";

export default class OrderList extends React.Component {
  async updateOrder(order, newStatus, user) {
    await updateOrderAPI(order, newStatus, user, "").finally(() => {
      this.props.updateCallback();
    });
  }

  pressOrderItem(order) {
    this.props.onPressOrder(order);
  }

  render() {
    const orders = formatOrders(this.props.data);
    const user = this.props.user;
    return orders.length > 0 ? (
      orders.map((order, index) => (
        <View key={index}>
          <List.Item
            key={index}
            style={{
              marginLeft: -16,
              marginRight: -16,
            }}
            title={order.key.slice(0, 16)}
            descriptionStyle={{ fontWeight: "bold" }}
            onPress={() => this.pressOrderItem(order)}
            description={`${getOrderStatusText(order.status)} • ${
              order.distance
            } km`}
            right={() =>
              order.assigned ? (
                order.status == PREPARING ? (
                  <View />
                ) : order.status == DELIVERING ? (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="close"
                      size={23}
                      mode="contained"
                      containerColor="red"
                      iconColor="white"
                      onPress={() => this.props.cancelCallback(order)}
                    />
                    <IconButton
                      icon="check"
                      size={23}
                      mode="contained"
                      containerColor="green"
                      iconColor="white"
                      onPress={() => this.updateOrder(order, DELIVERED, user)}
                    />
                  </View>
                ) : (
                  <Button
                    mode="contained"
                    buttonColor={theme.colors.secondary}
                    onPress={() => this.updateOrder(order, DELIVERING, user)}
                    labelStyle={{
                      marginLeft: 12,
                      marginRight: 12,
                    }}
                  >
                    Picked up
                  </Button>
                )
              ) : (
                <Button
                  icon="clipboard-arrow-down"
                  mode="contained"
                  buttonColor={theme.colors.primary}
                  onPress={() => this.updateOrder(order, "", user)}
                  style={{ marginRight: -12 }}
                >
                  Assign!
                </Button>
              )
            }
          />
        </View>
      ))
    ) : (
      <Text style={{ fontStyle: "italic", color: "grey", paddingVertical: 10 }}>
        There are no orders..
      </Text>
    );
  }
}
