import React from 'react';
import { Text, Alert, AsyncStorage, View, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

import User from '../User';
import Styles from '../constants/styles';

export default class LoginScreen extends React.Component {

  static navigationOptions = {
    header: null,

  };

  state = {
    phone: '',
    name: '',
  };
  handleChange = key => val => {
    this.setState({ [key]: val });
  }

  submitForm = async () => {
    if(this.state.phone.length < 10) {
      Alert.alert('Error', 'Wrong phone number')
    } else if (this.state.name.length < 3) {
      Alert.alert('Error', 'Wrong name')
    } else {
      // save user data
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;
      firebase.database().ref('users/'+User.phone).set({name: this.state.name});
      this.props.navigation.navigate('App');
    }
  }
  render() {
    return (
      <View style={Styles.container}>
        <TextInput 
          placeholder="Phone number" 
          keyboardType="number-pad"
          style={Styles.input} 
          value={this.state.phone} 
          onChangeText={this.handleChange('phone')}
        />
        <TextInput 
          placeholder="Name" 
          style={Styles.input} 
          value={this.state.name} 
          onChangeText={this.handleChange('name')}        
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={Styles.btnText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


