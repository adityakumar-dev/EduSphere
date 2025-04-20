import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();

// Collection referencesconst assignmentCollection = db.collection('assignments');

const getAssignmentList = async (teacherId) => {
    if (!teacherId) {
      throw new Error("Teacher ID is required");
    }
  
    try {
      // Firestore query to filter assignments by teacherId
      const querySnapshot = await assignmentCollection.where('teacherId', '==', teacherId).get();
  
      if (querySnapshot.empty) {
        return []; // No assignments found
      }
  
      // Map through the documents and return assignment data
      const assignments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return assignments;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw new Error(error);
    }
  };
  
const createAssignment = async (assignmentData) => {
    try {
        const { title, description, dueDate, teacherId } = assignmentData;

        if (!title || !description || !dueDate) {
            throw new Error('Title, description, and due date are required fields');
        }

        if (teacherId) {
            const teacherDoc = await teacherCollection.doc(teacherId).get();
            if (!teacherDoc.exists) {
                throw new Error('Teacher not found');
            }
        }

        const assignmentWithTimestamps = {
            ...assignmentData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const assignmentRef = await assignmentCollection.add(assignmentWithTimestamps);

        return assignmentRef.id;
    } catch (error) {
        console.error('Error creating assignment:', error);
        throw error;
    }
};

const getAssignmentById = async (assignmentId) => {
    try {
        const assignmentDoc = await assignmentCollection.doc(assignmentId).get();

        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }

        return {
            id: assignmentDoc.id,
            ...assignmentDoc.data(),
        };
    } catch (error) {
        console.error('Error getting assignment by ID:', error);
        throw error;
    }
};

const updateAssignment = async (assignmentId, updateData) => {
    try {
        const assignmentRef = assignmentCollection.doc(assignmentId);
        const assignmentDoc = await assignmentRef.get();

        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }

        const dataWithTimestamp = {
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await assignmentRef.update(dataWithTimestamp);
    } catch (error) {
        console.error('Error updating assignment:', error);
        throw error;
    }
};

const deleteAssignment = async (assignmentId) => {
    try {
        const assignmentRef = assignmentCollection.doc(assignmentId);
        const assignmentDoc = await assignmentRef.get();

        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }

        await assignmentRef.delete();
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};

// ✅ Submitting assignment by student
const submitAssignment = async (assignmentId, studentId, submissionData) => {
    try {
        const assignmentRef = assignmentCollection.doc(assignmentId);

        const assignmentDoc = await assignmentRef.get();
        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }

        await assignmentRef.collection('submittedBy').doc(studentId).set({
            ...submissionData,
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        throw error;
    }
};

const getAllSubmissions = async (assignmentId) => {
    try {
        const submissionsSnap = await assignmentCollection
            .doc(assignmentId)
            .collection('submittedBy')
            .get();

        return submissionsSnap.docs.map(doc => ({
            studentId: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
    }
};

export const assignmentController = {
    getAssignmentList,
    createAssignment,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getAllSubmissions,
    getAssignmentList,
};
