// Config file
import * as firebase from "firebase";

const config = {    
    // Your web app's Firebase configuration

        apiKey: "AIzaSyAAMldk-mFe20w4__7uNCpUYyMgJF9wTts",
        authDomain: "fir-chat-28f5a.firebaseapp.com",
        databaseURL: "https://fir-chat-28f5a.firebaseio.com",
        projectId: "fir-chat-28f5a",
        storageBucket: "fir-chat-28f5a.appspot.com",
        messagingSenderId: "297914044803",
        appId: "1:297914044803:web:140cb5fccc19e72a4826b6"
    };

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
