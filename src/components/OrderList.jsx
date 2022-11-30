import React from "react";
import { View } from "react-native";
import { Divider, IconButton, List, Text } from "react-native-paper";
import {
  DELIVERED,
  DELIVERY_PROBLEM,
  formatOrders,
  getOrderStatusText,
  updateOrderAPI,
} from "../stores/oders";
import { theme } from "../core/theme";

export default class OrderList extends React.Component {
  async updateOrder(order, newStatus) {
    await updateOrderAPI(order, newStatus).finally(() =>
      this.props.updateCallback()
    );
  }

  render() {
    const orders = formatOrders(this.props.data);
    return (
      <View>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <View key={index}>
              <Divider />
              <List.Item
                key={index}
                style={{ marginRight: -20 }}
                title={order.customer.slice(0, 16)}
                description={`${getOrderStatusText(order.status)} - ${
                  Math.round(order.distance * 10) / 10
                } km`}
                right={() =>
                  order.assigned ? (
                    <View style={{ flexDirection: "row" }}>
                      <IconButton
                        icon="close"
                        size={22}
                        mode="contained"
                        containerColor="red"
                        iconColor="white"
                        onPress={() =>
                          this.updateOrder(order, DELIVERY_PROBLEM)
                        }
                      />
                      <IconButton
                        icon="check"
                        size={22}
                        mode="contained"
                        containerColor="green"
                        iconColor="white"
                        onPress={() => this.updateOrder(order, DELIVERED)}
                      />
                    </View>
                  ) : (
                    <IconButton
                      icon="upload"
                      size={22}
                      mode="contained"
                      containerColor={theme.colors.primary}
                      iconColor="white"
                      onPress={() => this.updateOrder(order)}
                    />
                  )
                }
              />
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: "italic", color: "grey", paddingTop: 10 }}>
            There are no orders..
          </Text>
        )}
      </View>
    );
  }
}
