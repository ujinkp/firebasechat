import React from 'react';
import {SafeAreaView, Text, TextInput, Alert, AsyncStorage, TouchableOpacity} from 'react-native';
import firebase from 'firebase';

import User from '../User';
import Styles from '../constants/styles';

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Profile'
    }

    state = {
        name: User.name
    }

    handlerChange = key => val => {
        this.setState({[key]: val})
    }

    _logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    changeName = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('Error', 'Please enter valid name');
        } else if (User.name !== this.state.name){
            firebase.database().ref('users').child(User.phone).set({name: this.state.name})
            User.name = this.state.name;
            Alert.alert('Success', 'Name changed successful');
        }
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <Text style={{fontSize: 20}}>
                    {User.phone}
                </Text>
                <TextInput 
                    style={Styles.input}
                    value={this.state.name}
                    onChangeText = {this.handlerChange('name')}
                />
                <TouchableOpacity onPress={this.changeName}>
                    <Text style={Styles.btnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._logout}>
                    <Text style={Styles.btnText}>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}