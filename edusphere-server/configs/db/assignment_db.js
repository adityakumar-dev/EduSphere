import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();

// Collection references
const assignmentCollection = db.collection('assignments');
const teacherCollection = db.collection('teachers');

/**
 * Create an assignment with hierarchical structure
 * @param {string} branch - Branch name (e.g., 'Computer Science', 'Mechanical')
 * @param {string} year - Academic year (e.g., '2023-2024')
 * @param {Object} assignmentData - Assignment information
 * @returns {Promise<string>} - Assignment ID
 */
const createAssignment = async (assignmentData) => {
    try {
        // Validate required fields
        if (!assignmentData.title || !assignmentData.description || !assignmentData.dueDate) {
            throw new Error('Title, description, and due date are required fields');
        }

        // Check if teacher exists
        if (assignmentData.teacherId) {
            const teacher = await teacherCollection.doc(assignmentData.teacherId).get();
            if (!teacher.exists) {
                throw new Error('Teacher not found');
            }
        }

        // Prepare assignment data with timestamps
        const assignmentWithTimestamps = {
            ...assignmentData,
            
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Create assignment document in the hierarchical structure
        const assignmentRef = await assignmentCollection
            .doc(assignmentData.branch)
            .collection('years')
            .doc(assignmentData.year)
            .collection('assignments')
            .add(assignmentWithTimestamps);
            
        return assignmentRef.id;
    } catch (error) {
        console.error('Error creating assignment:', error);
        throw error;
    }
};

/**
 * Get all assignments for a specific branch and year
 * @param {string} branch - Branch name
 * @param {string} year - Academic year
 * @returns {Promise<Array>} - Array of assignment data
 */
const getAssignmentsByBranchAndYear = async (branch, year) => {
    try {
        const assignmentsSnapshot = await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .get();
            
        return assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting assignments by branch and year:', error);
        throw error;
    }
};

/**
 * Get assignment by ID
 * @param {string} branch - Branch name
 * @param {string} year - Academic year
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise<Object>} - Assignment data
 */
const getAssignmentById = async (branch, year, assignmentId) => {
    try {
        const assignmentDoc = await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .doc(assignmentId)
            .get();
            
        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }
        
        return {
            id: assignmentDoc.id,
            ...assignmentDoc.data()
        };
    } catch (error) {
        console.error('Error getting assignment by ID:', error);
        throw error;
    }
};

/**
 * Update assignment
 * @param {string} branch - Branch name
 * @param {string} year - Academic year
 * @param {string} assignmentId - Assignment ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
const updateAssignment = async (branch, year, assignmentId, updateData) => {
    try {
        // Check if assignment exists
        const assignmentDoc = await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .doc(assignmentId)
            .get();
            
        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }
        
        // Add updated timestamp
        const dataWithTimestamp = {
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .doc(assignmentId)
            .update(dataWithTimestamp);
    } catch (error) {
        console.error('Error updating assignment:', error);
        throw error;
    }
};

/**
 * Delete assignment
 * @param {string} branch - Branch name
 * @param {string} year - Academic year
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise<void>}
 */
const deleteAssignment = async (branch, year, assignmentId) => {
    try {
        // Check if assignment exists
        const assignmentDoc = await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .doc(assignmentId)
            .get();
            
        if (!assignmentDoc.exists) {
            throw new Error('Assignment not found');
        }
        
        await assignmentCollection
            .doc(branch)
            .collection('years')
            .doc(year)
            .collection('assignments')
            .doc(assignmentId)
            .delete();
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};

/**
 * Get all branches
 * @returns {Promise<Array>} - Array of branch names
 */
const getAllBranches = async () => {
    try {
        const branchesSnapshot = await assignmentCollection.get();
        return branchesSnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error('Error getting all branches:', error);
        throw error;
    }
};

/**
 * Get all years for a specific branch
 * @param {string} branch - Branch name
 * @returns {Promise<Array>} - Array of year names
 */
const getYearsByBranch = async (branch) => {
    try {
        const yearsSnapshot = await assignmentCollection
            .doc(branch)
            .collection('years')
            .get();
            
        return yearsSnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error('Error getting years by branch:', error);
        throw error;
    }
};

module.exports = {
    createAssignment,
    getAssignmentsByBranchAndYear,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    getAllBranches,
    getYearsByBranch
};


