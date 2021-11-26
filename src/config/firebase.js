import firebase from 'firebase';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCmGNgun1_sfhTdmbMujMvSDLvyz5ey87w',
  authDomain: 'agendamento-de-salas-3.firebaseapp.com',
  databaseURL: 'https://agendamento-de-salas-3-default-rtdb.firebaseio.com',
  projectId: 'agendamento-de-salas-3',
  storageBucket: 'agendamento-de-salas-3.appspot.com',
  messagingSenderId: '121954241006',
  appId: '1:121954241006:web:b35ce9a85cf6e1afb4a6ff',
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
