import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { 
    getAuth
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXnCro4qxDaiO9nt-dex3DJ9oWMtlzNFI",
    authDomain: "toodaloo-climateneutral.firebaseapp.com",
    projectId: "toodaloo-climateneutral",
    storageBucket: "toodaloo-climateneutral.appspot.com",
    messagingSenderId: "932425025323",
    appId: "1:932425025323:web:0892d5352c6e8145cd676e",
    measurementId: "G-SHBB37KBJL"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

