import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();
const  BranchYearSubjectCollection = db.collection('BranchYearSubject')
const addBranchYearSubject = async (year, branch, subject) => {
    if (!year || !branch || !subject) {
      throw new Error("All fields are required");
    }
  
    const docRef = BranchYearSubjectCollection.doc(branch);
  
    // Merge the subject into the correct year field
    await docRef.set({
      [year]: subject // subject should be an array like ['Math', 'Physics']
    }, { merge: true }); // merge to preserve other years
  };
  const getBranchYearSubject = async()=>{
    const docRef =await BranchYearSubjectCollection.get();
  return  docRef.docs.map(doc => ({'id' : doc.id, ...doc.data()}))
  }

export { addBranchYearSubject,getBranchYearSubject};