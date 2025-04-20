import { createFolder } from '../create_directory_structure.js';
import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();
const teachersCollection = db.collection('teachers');

const usersCollection = db.collection('users');
const createTeacher = async (teacherData) => {
    try {
        // Validate required fields
        if (!teacherData.email || !teacherData.name) {
            throw new Error('Email and name are required fields');
        }

        // Check if teacher with email already exists
       let existingTeacher = await teachersCollection.where('email', '==', teacherData.email).get();
            if (existingTeacher.length > 0) {
                throw new Error('Teacher with this email already exists');
            }
        //check uid is already present
        const temp = await teachersCollection.doc(teacherData.uid).get();
        if(temp.exists){
            throw new Error('Teacher with this uid already exists');
        }
        
        //add teacher with uid
        // Add timestamp fields
        const teacherWithTimestamps = {
            ...teacherData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await teachersCollection.doc(teacherData.uid).set(teacherWithTimestamps);
        return docRef.id;
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};

const getTeacher = async (id) => {  
    try {
        let teacher = await teachersCollection.doc(id).get();
        if (!teacher.exists) {
           teacher = await teachersCollection.where('email', '==', id).get();
        }
        if(!teacher.exists){
            throw new Error('Teacher not found');
        }
        return {...teacher.data() };
    } catch (error) {
        console.error('Error getting teacher by id:', error);
        throw error;
    }
};


const updateTeacher = async (teacherId, updateData) => {
    try {
        // Check if teacher exists
        const teacher = await teachersCollection.doc(teacherId).get();
        if (!teacher.exists) {
            throw new Error('Teacher not found');
        }

        // Add updated timestamp
        const dataWithTimestamp = {
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await teachersCollection.doc(teacherId).update(dataWithTimestamp);
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
};

const deleteTeacher = async (teacherId) => {
    try {
        // Check if teacher exists
        const teacher = await teachersCollection.doc(teacherId).get();
        if (!teacher.exists) {
            throw new Error('Teacher not found');
        }

        await teachersCollection.doc(teacherId).delete();
    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
};
const updateCredentials = async (id, accessToken, refreshToken, scope) => {
    const teacherRef = teachersCollection.doc(id);
    const teacherDoc = await teacherRef.get();

    if (!teacherDoc.exists) {
        throw new Error('Teacher not found');
    }

    // Update the credentials for the teacher
    await teacherRef.update({
        'credentials.accessToken': accessToken,
        'credentials.refreshToken': refreshToken,
        'credentials.scope': scope,
    });
   const mainFolder = await createFolder("EduSphere_Main",accessToken)
   const assignmentFolder = await createFolder("Assignment",accessToken,parentId)
   const profileFolder = await createFolder("Profile",accessToken,parentId)
   const notesFolder = await createFolder("Notes",accessToken,parentId)
   await teacherRef.set({
        drive : {
            'main' : mainFolder,
            'assignment' : assignmentFolder,
            'profile' : profileFolder,
            'notes' : notesFolder
        }
    })
    return true;  // If the update was successful, return true
};

export {
    createTeacher,
    getTeacher,
    updateCredentials,
    updateTeacher,
    deleteTeacher
};