/* eslint-disable no-sequences */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  Text,
  TextInput,
  Keyboard,
  Animated,
  Platform,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import firebase from 'firebase';

import Styles from '../constants/styles';
import User from '../User';

const isIOS = Platform.OS === 'ios';

export default class ChatScreen extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //     return {
  //         title: navigation.getParam('name', null)
  //     }
  // }
  static navigationOptions = {
    title: 'name',
  };

  constructor(props) {
    super(props);
    this.state = {
      person: {
        // name: props.navigation.navigate.getParam('name'),
        // phone: props.navigation.navigate.getParam('phone'),
        // name: props.navigation.navigate.route.params.name ('name'),
        // phone: props.navigation.navigate.route.params.name ('phone'),
        // name: this.props.navigation.navigate('name'),
        // phone: this.props.navigation.navigate('phone'),
        // name: props.route.params.name,
        // phone: props.route.params.phone,
      },
      textMessage: '',
      messageList: [],
      dbRef: firebase.database().ref('messages'),
    };
    this.keyBoardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
  }

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
      e => this.keyboardEvent(e, true),
    );
    this.keyboardHideListener = Keyboard.addListener(
      isIOS ? 'keyboardWillHide' : 'keyboardDidHide ',
      e => this.keyboardEvent(e, false),
    );
    this.state.dbRef
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added'),
      value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      };
  }

  componentWillUnmount() {
    this.state.dbref.off();
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardEvent = (event, isShow) => {
    let heightOS = isIOS ? 60 : 80;
    let bottomOS = isIOS ? 120 : 140;
    Animated.parallel([
      Animated.timing(this.keyBoardHeight, {
        duration: event.duration,
        toValue: isShow ? heightOS : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: event.duration,
        toValue: isShow ? bottomOS : 60,
      }),
    ]).start();
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = this.state.dbRef
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        User.phone + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        this.state.person.phone + '/' + User.phone + '/' + msgId
      ] = message;
      this.state.dbRef.update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          maxWidth: '60%',
          alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {this.convertTime(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    let {height} = Dimensions.get('window');
    // console.log("===---------->", navigation)
    // console.log('dbRef====>', dbRef)
    // console.log("===---------->", this.props.navigation)
    return (
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <Animated.View
          style={[Styles.bottomBar, {bottom: this.keyBoardHeight}]}>
          <TextInput
            style={Styles.inputMessage}
            value={this.state.textMessage}
            placeholder="Type message..."
            onChange={this.handleChange('textMessage')}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={Styles.sendButton}>
            <Image
              source={require('../images/send.png')}
              style={{tintColor: 'white', resizeMode: 'contain', height: 20}}
            />
          </TouchableOpacity>
        </Animated.View>
        <FlatList
          ref={ref => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({animated: true})
          }
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
          style={{paddingTop: 5, paddingHorizontal: 5, height}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <Animated.View style={{height: this.bottomPadding}} />
          }
        />
      </KeyboardAvoidingView>
    );
  }
}
