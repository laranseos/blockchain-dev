import firebase_app from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)
export const getAllDoument = async (col) => {

    let result = null;
    let error = null;

    try {
        const querySnapshot = await getDocs(collection(db, "ordinals"));
        let arr = [];
        querySnapshot.forEach((doc) => {
          arr.push({
            id: doc.id, ...doc.data()
          })
        });
        result = arr;
    } catch (e) {
        error = e;
    }

    return { result, error };
}
