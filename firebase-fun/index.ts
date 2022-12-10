//firebase get orders 
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

 
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO9FQOrl-DzEwFJBN9RR59T-lxn8RsoB4",
  authDomain: "fastugadriver-taes.firebaseapp.com",
  projectId: "fastugadriver-taes",
  storageBucket: "fastugadriver-taes.appspot.com",
  messagingSenderId: "169236192365",
  appId: "1:169236192365:web:c7149e73e6738e0a353364",
};

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth;

//go to db and get orders where status is 2 (pending)
export const getCanceledOrders = async () => {
	//orders where status is 5 and the order id is not present on notifications causeOrder
	const orders = await db.collection("orders").where("status", "==", 5).get();
	
  return orders.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

getCanceledOrders().then((orders) => {
  console.log("Notifying canceled orders!: "+orders);
  //foreach canceled order create a notification where causeOrder is the order id, created_on is the current time, message is "A tua encomenda foi cancelada porque: "+ cancel_justification  and owner is the assigned_driver
  orders.forEach((order) => {
	db.collection("notifications").add({
	  causeOrder: order.id,
	  created_on: firebase.firestore.Timestamp.fromDate(new Date()),
	  message: "A tua encomenda foi cancelada porque: " + order.cancel_justification,
	  owner: order.assigned_driver,
	});
  }); 

});
