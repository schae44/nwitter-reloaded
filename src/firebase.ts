import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfMy_dwxerJHCFtGOHWinFPxFKno6YtHo",
  authDomain: "nwitter-reloaded-678d2.firebaseapp.com",
  projectId: "nwitter-reloaded-678d2",
  storageBucket: "nwitter-reloaded-678d2.appspot.com",
  messagingSenderId: "869151513925",
  appId: "1:869151513925:web:bd3e50d191ca960fa4f22c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
