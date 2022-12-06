import React from "react";
import { View } from "react-native";
import { Button, Divider, IconButton, List, Text } from "react-native-paper";
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


  async updateOrder(order, newStatus) {
    await updateOrderAPI(order, newStatus).finally(() =>
      this.props.updateCallback()
    );
  }

  pressOrderItem(order) {
    this.props.onPressOrder(order);
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
                style={{ marginRight: -20, marginLeft: -14 }}
                title={order.customer.slice(0, 16)}
                descriptionStyle={{ fontWeight: "bold" }}
                onPress={() => this.pressOrderItem(order)}
                description={`${getOrderStatusText(order.status)} • ${
                  order.distance
                } km`}
                right={() =>
                  order.assigned ? (
                    order.status == PREPARING ? (
                      <Button
                        mode="contained"
                        buttonColor="grey"
                        disabled={true}
                        labelStyle={{
                          marginLeft: 15,
                          marginRight: 15,
                          color: "#373837",
                        }}
                      >
                        Waiting..
                      </Button>
                    ) : order.status == DELIVERING ? (
                      <View style={{ flexDirection: "row" }}>
                        <IconButton
                          icon="close"
                          size={23}
                          mode="contained"
                          containerColor="red"
                          iconColor="white"
                          onPress={() =>
                            this.updateOrder(order, DELIVERY_PROBLEM)
                          }
                        />
                        <IconButton
                          icon="check"
                          size={23}
                          mode="contained"
                          containerColor="green"
                          iconColor="white"
                          onPress={() => this.updateOrder(order, DELIVERED)}
                        />
                      </View>
                    ) : (
                      <Button
                        mode="contained"
                        buttonColor={theme.colors.secondary}
                        onPress={() => this.updateOrder(order, DELIVERING)}
                        labelStyle={{
                          marginLeft: 15,
                          marginRight: 15,
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
                      onPress={() => this.updateOrder(order)}
                    >
                      Assign!
                    </Button>
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
