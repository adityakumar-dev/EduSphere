import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();
const usersCollection = db.collection('users');
const getStudentCollectionRef = (branchId, yearId, sectionId) =>
    db.collection('branches').doc(branchId)
      .collection('years').doc(yearId)
      .collection('sections').doc(sectionId)
      .collection('students');

/**
 * Create a student in the structured path
 */
const createStudent = async (branchId, yearId, sectionId, studentData) => {
    try {
        if (!studentData.email || !studentData.name) {
            throw new Error('Email and name are required fields');
        }

        const studentRef = getStudentCollectionRef(branchId, yearId, sectionId);

        // Check if student with email exists
        const existing = await studentRef.where('email', '==', studentData.email).get();
        if (!existing.empty) throw new Error('Student with this email already exists');

        const withTimestamps = {
            ...studentData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await studentRef.doc(studentData.uid).set(withTimestamps);
        return docRef.id;

    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

/**
 * Get student by email in a given section
 */
const getStudentByEmail = async (id) => {
    try {
        let userRef =await usersCollection.where( 'email' , '==', id).get();
     
        if(userRef.empty){
            userRef =await usersCollection.where('uid', '==', id).get();
            if(userRef.empty) return null;
        }
        const user = userRef.docs[0].data();
        const ref = getStudentCollectionRef(user.branchId, user.yearId, user.sectionId);
        const snapshot = await ref.where('email', '==', user.email).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting student by email:', error);
        throw error;
    }
};

/**
 * Update student
 */
const updateStudent = async (branchId, yearId, sectionId, studentId, updateData) => {
    try {
        const ref = getStudentCollectionRef(branchId, yearId, sectionId).doc(studentId);
        const doc = await ref.get();
        if (!doc.exists) throw new Error('Student not found');

        await ref.update({
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

/**
 * Delete student
 */
const deleteStudent = async (branchId, yearId, sectionId, studentId) => {
    try {
        const ref = getStudentCollectionRef(branchId, yearId, sectionId).doc(studentId);
        const doc = await ref.get();
        if (!doc.exists) throw new Error('Student not found');

        await ref.delete();
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};

/**
 * Store Google Drive credentials
 */
const storeStudentDriveCredentials = async (branchId, yearId, sectionId, studentId, driveCredentials) => {
    try {
        const ref = getStudentCollectionRef(branchId, yearId, sectionId).doc(studentId);
        await ref.update({ driveCredentials });
    } catch (error) {
        console.error('Error storing drive credentials:', error);
        throw error;
    }
};

/**
 * Get all students of a year/branch/section
 */
const getStudentsBySection = async (branchId, yearId, sectionId) => {
    try {
        const snapshot = await getStudentCollectionRef(branchId, yearId, sectionId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting student list:', error);
        throw error;
    }
};
const studentList = async (type, year, branch) => {
    if(type === 'all'){
        const snapshot = await usersCollection.where('role', '==', 'student').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }else if(type === 'year'){
        const snapshot = await usersCollection.where('role', '==', 'student').where('year', '==', year).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }else if(type === 'branch'){
        const snapshot = await usersCollection.where('role', '==', 'student').where('branch', '==', branch).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}
export {
    createStudent,
    getStudentByEmail,
    updateStudent,
    deleteStudent,
    storeStudentDriveCredentials,
    getStudentsBySection,
    studentList
};
