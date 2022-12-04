import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase";
import { getDistance } from "../utils/locationUtil";
import { query, where, collection, getDocs } from "firebase/firestore";

export const PREPARING = 1;
export const READY_PICK_UP = 2;
export const DELIVERING = 3;
export const DELIVERED = 4;
export const DELIVERY_PROBLEM = 5;

export async function updateOrderAPI(order, newStatus, userID) {
  const updateObj = newStatus
    ? { assigned_driver: userID, status: newStatus }
    : { assigned_driver: userID };

  return await db.collection("orders").doc(order.key).update(updateObj);
}

export async function fetchUnassignedOrdersAPI() {
  const unssOrdersQuery = query(
    collection(db, "orders"),
    where("assigned_driver", "==", ""),
    where("status", "<", 4)
  );

  return await getDocs(unssOrdersQuery);
}

export async function fetchDriverOrdersAPI(id) {
  const driverOrderQuery = query(
    collection(db, "orders"),
    where("assigned_driver", "==", id),
    where("status", "<", 4)
  );

  return await getDocs(driverOrderQuery);
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
      return "Ready for pick-up";

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
