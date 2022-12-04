import React from "react";
import { View } from "react-native";
import { Button, Divider, IconButton, List, Text } from "react-native-paper";
import {
  DELIVERED,
  DELIVERING,
  DELIVERY_PROBLEM,
  formatOrders,
  getOrderStatusText,
  PREPARING,
  READY_PICK_UP,
  updateOrderAPI,
} from "../stores/orders";
import { theme } from "../core/theme";

export default class OrderList extends React.Component {
  async updateOrder(order, newStatus, user) {
    await updateOrderAPI(order, newStatus, user, "").finally(() => {
      this.props.updateCallback();
    });
  }

  render() {
    const orders = formatOrders(this.props.data);
    const user = this.props.user;
    return (
      <View>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <View key={index}>
              <Divider />
              <List.Item
                key={index}
                style={{ marginRight: -20, marginLeft: -14 }}
                title={order.key.slice(0, 16)}
                descriptionStyle={{ fontWeight: "bold" }}
                description={`${getOrderStatusText(order.status)} • ${
                  Math.round(order.distance * 10) / 10
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
                          onPress={() => this.props.cancelCallback(order)}
                        />
                        <IconButton
                          icon="check"
                          size={23}
                          mode="contained"
                          containerColor="green"
                          iconColor="white"
                          onPress={() =>
                            this.updateOrder(order, DELIVERED, user)
                          }
                        />
                      </View>
                    ) : (
                      <Button
                        mode="contained"
                        buttonColor={theme.colors.secondary}
                        onPress={() =>
                          this.updateOrder(order, DELIVERING, user)
                        }
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
                      onPress={() => this.updateOrder(order, "", user)}
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
