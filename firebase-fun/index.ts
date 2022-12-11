import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const FCM = require('fcm-notification');
const serverKey='./privatekey.json';
const fcm = new FCM(serverKey);
// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAO9FQOrl-DzEwFJBN9RR59T-lxn8RsoB4",
	authDomain: "fastugadriver-taes.firebaseapp.com",
	projectId: "fastugadriver-taes",
	storageBucket: "fastugadriver-taes.appspot.com",
	messagingSenderId: "169236192365",
	appId: "1:169236192365:web:c7149e73e6738e0a353364",
	measurementId: "G-7LHG2G85ZH"
  };
  
  

let app;

  app = firebase.initializeApp(firebaseConfig);
  
  //messaging = getMessaging(app); 



const db = app.firestore();

/*messaging().getToken().then((currentToken) => {
	messagingToken=currentToken;
});*/
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
	  created_on: new Date(),
	  message: "A tua encomenda foi cancelada porque: " + order.cancel_justification,
	  owner: order.assigned_driver,
	});
	
	//send notification with topic order.assigned_driver
	console.log("Sending notification to: "+order.assigned_driver)
	const message = {
		
		android: {
		  priority: "HIGH",
		  notification: {
			title: "Encomenda "+order.id.slice(0,6)+" cancelada",
			body: "A tua encomenda foi cancelada porque: " + order.cancel_justification,
			
		  }

		},

		topic: order.assigned_driver,
	  };
	  
	  fcm.send(message, function (err, response) {
		if (err) {
		  console.log("Something has gone wrong!");
		  console.log(err);
		} else {
		  console.log("Successfully sent with response: ", response);
		}
	}); 
	
  });
 

});
