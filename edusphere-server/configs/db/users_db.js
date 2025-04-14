// users/[uid] = {
//     name: "John Doe",
//     email: "john@example.com",
//     role: "student", // or "teacher"
//     branchId: "cse",
//     yearId: "2",
//     sectionId: "A",
//     driveConnected: true,
//     driveAccessToken: "...",
//     createdAt: Timestamp
//   }
import { getFirebaseAdmin } from '../firebase.js';
const admin = await getFirebaseAdmin();
const db = admin.firestore();

const usersCollection = db.collection('users');


const createUser = async (userData) => {
    
    try {
        //check uid is already present
        const temp = await usersCollection.doc(userData.uid).get();
        if(temp.exists){
            throw new Error('User already exists');
        }
        const docRef = await usersCollection.doc(userData.uid).set(userData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const getUser = async (uid) => {
    try {
        const docRef = await usersCollection.doc(uid).get();
        return docRef.data();
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

const updateUser = async (uid, userData) => {
    try {
        const docRef = await usersCollection.doc(uid).update(userData);
        return docRef.id;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export { createUser, getUser, updateUser };

