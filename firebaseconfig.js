import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBic-fkYFUwn6RMVIu67vFe-FSjM5lCQCw",
    authDomain: "react-native-87ef7.firebaseapp.com",
    projectId: "react-native-87ef7",
    storageBucket: "react-native-87ef7.firebasestorage.app",
    messagingSenderId: "1088205422233",
    appId: "1:1088205422233:web:b02cd9fe4a0ca2cb580208",
    measurementId: "G-YSVTVLQ531"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
