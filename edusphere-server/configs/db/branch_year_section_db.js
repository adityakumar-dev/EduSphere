import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();

const branchCollection = db.collection('branch');
const yearCollection = db.collection('year');
const sectionCollection = db.collection('section');

// add branch if not exists
const addBranch = async (branch) => {
    const branchRef = branchCollection.doc(branch);
    if(!branchRef.exists){
        await branchCollection.doc(branch).set({});
    }
}
const addYear = async (year) => {
    const yearRef = yearCollection.doc(year);
    if(!yearRef.exists){
        await yearCollection.doc(year).set({});
    }
}
const addSection = async (section) => {
    const sectionRef = sectionCollection.doc(section);
    if(!sectionRef.exists){
        await sectionCollection.doc(section).set({});
    }
}



export { addBranch, addYear, addSection };