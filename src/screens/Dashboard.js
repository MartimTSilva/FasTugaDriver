import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import navigation

export default function Dashboard({ navigation }) {
	// fetch user from navigation
	const user = navigation.getParam("user");
	console.log(user);
  return (
    <View style={styles.container}>
      <Text>Hello {user.name}!</Text>
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
