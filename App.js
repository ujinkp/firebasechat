/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';

import {Routes} from './screens/Routes';
import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';
// import AuthLoadingScreen from './screens/AuthLoadingScreen';
// import ChatScreen from './screens/ChatScreen';
// import ProfileScreen from './screens/ProfileScreen';

const AppStack = createStackNavigator({
  // Home: HomeScreen,
  // Chat: ChatScreen,
  [Routes.Home]: require('./screens/HomeScreen').default,
  [Routes.Chat]: require('./screens/ChatScreen').default,
});

// const AppStack = createStackNavigator();

AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0;

  return {
    tabBarVisible,
  };
};

const AuthStack = createStackNavigator({Login: LoginScreen});
// const AuthStack = createStackNavigator();

const TabNavigator = createBottomTabNavigator(
  {
    // Chats: AppStack,
    // Profile: ProfileScreen,
    [Routes.Chats]: AppStack,
    [Routes.Profile]: require('./screens/ProfileScreen').default,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName = require('./images/chats.png');
        if (routeName === 'Profile') {
          imageName = require('./images/settings.png');
        }

        // You can return any component that you like here!
        return (
          <Image
            source={imageName}
            style={{width: 25, resizeMode: 'contain', tintColor}}
          />
        );
      },
    }),
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      // AuthLoading: AuthLoadingScreen,
      [Routes.AuthLoading]: require('./screens/AuthLoadingScreen').default,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AUTHLOADING',
    },
  ),
);

// export default function App() {
//   return (
//     <NavigationContainer>
//       <AppStack.Navigator>
//         <AppStack.Screen
//           name={[Routes.AuthLoading]}
//           component={[Routes.AuthLoading]}
//         />
//       </AppStack.Navigator>
//       <AuthStack.Navigator>
//         <AuthStack.Screen name="Login" component={[Routes.LoginScreen]} />
//       </AuthStack.Navigator>
//     </NavigationContainer>
//   );
// }
