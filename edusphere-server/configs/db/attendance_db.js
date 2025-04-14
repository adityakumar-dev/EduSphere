import { getFirebaseAdmin } from '../firebase.js';

const admin = await getFirebaseAdmin();
const db = admin.firestore();

const attendanceCollection = db.collection('attendance');
const studentCollection = db.collection('students');

/**
 * Create a new attendance record
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise<string>} - ID of the created attendance document
 */
const createAttendance = async (attendanceData) => {
    try {
        // Validate required fields
        if (!attendanceData.studentId || !attendanceData.date) {
            throw new Error('Student ID and date are required fields');
        }

        // Verify student existence
        const student = await studentCollection.doc(attendanceData.studentId).get();
        if (!student.exists) {
            throw new Error('Student not found');
        }

        // Add timestamps
        const attendanceWithTimestamps = {
            ...attendanceData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await attendanceCollection.add(attendanceWithTimestamps);
        return docRef.id;
    } catch (error) {
        console.error('Error creating attendance:', error);
        throw error;
    }
};

/**
 * Get attendance by ID
 * @param {string} attendanceId - Attendance ID
 * @returns {Promise<Object>} - Attendance data
 */
const getAttendanceWithId = async (attendanceId) => {
    try {
        const attendance = await attendanceCollection.doc(attendanceId).get();
        if (!attendance.exists) {
            throw new Error('Attendance record not found');
        }
        return { id: attendance.id, ...attendance.data() };
    } catch (error) {
        console.error('Error getting attendance by ID:', error);
        throw error;
    }
};

/**
 * Get attendance records by date
 * @param {string} date - Attendance date
 * @returns {Promise<Array>} - List of attendance records
 */
const getAttendanceWithDate = async (date) => {
    try {
        const snapshot = await attendanceCollection.where('date', '==', date).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting attendance by date:', error);
        throw error;
    }
};

/**
 * Get attendance records by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} - List of attendance records
 */
const getAttendanceByStudentId = async (studentId) => {
    try {
        const snapshot = await attendanceCollection.where('studentId', '==', studentId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting attendance by student ID:', error);
        throw error;
    }
};

/**
 * Update attendance record
 * @param {string} attendanceId - Attendance document ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<void>}
 */
const updateAttendance = async (attendanceId, updateData) => {
    try {
        const docRef = attendanceCollection.doc(attendanceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error('Attendance record not found');
        }

        const dataWithTimestamp = {
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await docRef.update(dataWithTimestamp);
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
    }
};

/**
 * Delete attendance record
 * @param {string} attendanceId - Attendance document ID
 * @returns {Promise<void>}
 */
const deleteAttendance = async (attendanceId) => {
    try {
        const docRef = attendanceCollection.doc(attendanceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error('Attendance record not found');
        }

        await docRef.delete();
    } catch (error) {
        console.error('Error deleting attendance:', error);
        throw error;
    }
};

module.exports = {
    createAttendance,
    getAttendanceWithId,
    getAttendanceWithDate,
    getAttendanceByStudentId,
    updateAttendance,
    deleteAttendance
};
