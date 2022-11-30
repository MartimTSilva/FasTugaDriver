import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase";
import { getDistance } from "../utils/locationUtil";

export const DELIVERED = 4;
export const DELIVERY_PROBLEM = 5;

export async function updateOrderAPI(order, newStatus) {
  const userID = JSON.parse(await AsyncStorage.getItem("@userData")).id;

  return await db
    .collection("orders")
    .doc(order.key)
    .update({ assigned_driver: userID, status: newStatus });
}

export async function fetchUnassignedOrdersAPI() {
  return await db.collection("orders").where("assigned_driver", "==", "").get();
}

export async function fetchDriverOrdersAPI(id) {
  return await db.collection("orders").where("assigned_driver", "==", id).get();
}

export function getOrderStatusText(status) {
  switch (status) {
    case 5:
      return "Cancelled";

    case 4:
      return "Delivered";

    case 3:
      return "Delivering";

    case 2:
      return "Ready for Pick-up";

    default:
      return "Preparing";
  }
}

export function formatOrders(orderList) {
  return orderList.map((item) => {
    return {
      key: item.key,
      status: item.status,
      customer: item.customer,
      assigned: !!item.assigned_driver,
      //distance to fastuga restaurant
      distance: getDistance(
        item.delivery_coords.latitude,
        item.delivery_coords.longitude,
        39.73447231382876,
        -8.821027283140435
      ),
    };
  });
}
