import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";

const screens = {
  Login: {
    screen: Login,
  },
  Dashboard: {
    screen: Dashboard,
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
