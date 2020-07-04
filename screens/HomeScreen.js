import React from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import firebase from '../constants/firebase';

import User from '../User';
import styles from '../constants/styles';

export default class HomeScreen extends React.Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: 'Chats',
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
    //                 <Image source={require('../images/user.png')} style={{ width: 32, height: 32, marginRight: 7}} />
    //             </TouchableOpacity>
    //         )
    //     }

    // };
    static navigationOptions = {
        header: null
    };
    state = {
        users: [],
        dbref: firebase.database().ref('users')
    }

    UNSAFE_componentWillMount() {
        this.state.dbref.on('child_added', (val) => {
            let person = val.val();
            person.phone = val.key;
            if (person.phone === User.phone) {
                User.name = person.name
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
        console.log('=----->>>>', this.state)
    }

    componentWillUnmount() {
        this.state.dbref.off()
    }

    renderRow = ({ item }) => {
        console.log('=----->>>>', this.item)
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {height} = Dimensions.get('window');
        return (
            <SafeAreaView>
                <FlatList
                    style={{height}}
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                    ListHeaderComponent={() => <Text style={{ fontSize: 30, marginVertical: 10, marginLeft: 10, fontWeight: 'bold' }}>Chats</Text>}
                />
            </SafeAreaView>
        )
    }
}