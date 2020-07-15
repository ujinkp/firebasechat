import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';
import firebase from 'firebase';

import User from '../User';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  //   UNSAFE_componentWillMount() {
  componentDidMount() {
    var config = {
      // Your web app's Firebase configuration

      apiKey: 'AIzaSyAAMldk-mFe20w4__7uNCpUYyMgJF9wTts',
      authDomain: 'fir-chat-28f5a.firebaseapp.com',
      databaseURL: 'https://fir-chat-28f5a.firebaseio.com',
      projectId: 'fir-chat-28f5a',
      storageBucket: 'fir-chat-28f5a.appspot.com',
      messagingSenderId: '297914044803',
      appId: '1:297914044803:web:140cb5fccc19e72a4826b6',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({config});
    }
  }

  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
