import express from 'express';
const app = express();
import { config } from 'dotenv';
await config();
import cors from 'cors';
app.use(cors());
import { Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from './configs/firebase.js';
// console.log(admin.credential);

import { checkValidSignupStudent, checkValidSignUpTeacher } from './middlewares/check_valid_signup.js';

app.use(express.json());
import { createStudent,  getStudentByEmail, studentList } from './configs/db/student_db.js';
import { createUser, getUser } from './configs/db/users_db.js';
import { createTeacher, getTeacher } from './configs/db/teacher_db.js';
import { addBranch, addYear, addSection } from './configs/db/branch_year_section_db.js';




//health check
app.get('/health-check', (req, res) => {
    res.send(true);
});

//teacher routes
app.post('/teacher/create',checkValidSignUpTeacher, async (req, res) => {
    const teacherData = req.body;
    const updatedTeacherData = {
        uid : teacherData.uid,
        name : teacherData.name,
        email : teacherData.email,
        role : 'teacher',
        gender : teacherData.gender,
        phone : teacherData.phone,
        address : teacherData.address,
        createdAt : Timestamp.now(),
        updatedAt : Timestamp.now()
    }
    const teacherId = await createTeacher(updatedTeacherData);
    res.status(201).json({ message: 'Teacher created successfully', teacherId });
});

app.get('/teacher/:id', async (req, res) => {
    const { id } = req.params;
    const teacher = await getTeacher(id);
    console.log(teacher)
    res.status(200).json({ teacher });
});

//student routes
app.post('/student/create',checkValidSignupStudent, async (req, res) => {
    const studentData = req.body;
   
    const userData = {
        uid: studentData.uid,
        name: studentData.name,
        email: studentData.email,
        role: 'student',
        branchId: studentData.branchId,    
        sectionId: studentData.sectionId,
        yearId: studentData.yearId,
        driveAccessToken : null,
        createdAt : Timestamp.now()
    }
   console.log(userData);
    const userId = await createUser(userData);
    const studentId = await createStudent(studentData.branchId, studentData.yearId, studentData.sectionId, studentData);
    await addBranch(studentData.branchId);
    await addYear(studentData.yearId);
    await addSection(studentData.sectionId);
    res.status(201).json({ message: 'Student created successfully', studentId });
});

app.get('/student/list', async (req, res) => {
    const { year, branch } = req.query;    
    const students = await studentList('all',year, branch);
    res.status(200).json(students);
});
app.get('/student/:crt', async (req, res) => {
    const { crt } = req.params;
   const student = await getStudentByEmail(crt);
    res.status(200).json({ student });
});

//server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message:err.message || 'Internal Server Error' });
});