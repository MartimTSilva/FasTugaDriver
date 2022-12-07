import { db } from "../../firebase";
import {
  getCoordsDistanceFromRestaurant,
  getDistance,
} from "../utils/locationUtil";
import { query, where, collection, getDocs } from "firebase/firestore";

export const PREPARING = 1;
export const READY_PICK_UP = 2;
export const DELIVERING = 3;
export const DELIVERED = 4;
export const DELIVERY_PROBLEM = 5;

export async function updateOrderAPI(order, newStatus, user, justification) {
  if (newStatus == DELIVERED) {
    user.balance = user.balance + calculateOrderEarnings(order.distance);
    await db.collection("users").doc(user.id).update(user);
  }

  const updateObj = newStatus
    ? {
        assigned_driver: user.id,
        status: newStatus,
        cancel_justification: justification,
      }
    : { assigned_driver: user.id };

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
      price: item.price,
      number_items: item.number_items,
      //distance to fastuga restaurant
      distance: getCoordsDistanceFromRestaurant(item.delivery_coords),
      coords: {
        lat: item.delivery_coords.latitude,
        long: item.delivery_coords.longitude,
      },
    };
  });
}

function calculateOrderEarnings(distance) {
  //Drivers earn fixed fees: 2€ per routes up until 3 km; 3€ per routes up until 10 km; and, 4€ for routes of greater length.
  if (distance <= 3.0) {
    return 2;
  } else if (distance <= 10.0) {
    return 3;
  } else {
    return 4;
  }
}
