import express from 'express';
const app = express();
import { config } from 'dotenv';
await config();
import cors from 'cors';
app.use(cors());
import { Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from './configs/firebase.js';
import { getValidAccessToken } from './middlewares/googleAuth.js';
// console.log(admin.credential);

import { checkValidSignupStudent, checkValidSignUpTeacher } from './middlewares/check_valid_signup.js';

app.use(express.json());
import { createStudent, getStudentByEmail, studentList } from './configs/db/student_db.js';
import { createUser, getUser } from './configs/db/users_db.js';
import { createTeacher, getTeacher, updateCredentials } from './configs/db/teacher_db.js';
import { assignmentController} from './configs/db/assignment_db.js'
import { addBranchYearSubject,getBranchYearSubject } from './configs/db/branch_year_section_db.js';


//health check
app.get('/health-check', (req, res) => {
    res.send(true);
});

//teacher routes
app.post('/teacher/create', checkValidSignUpTeacher, async (req, res) => {
    const teacherData = req.body;
    const updatedTeacherData = {
        uid: teacherData.uid,
        name: teacherData.name,
        email: teacherData.email,
        role: 'teacher',
        gender: teacherData.gender,
        phone: teacherData.phone,
        address: teacherData.address,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    }
    const teacherId = await createTeacher(updatedTeacherData);
    res.status(201).json({ message: 'Teacher created successfully', teacherId });
});

app.get('/teacher/:id', async (req, res) => {
    const { id } = req.params;
    const teacher = await getTeacher(id);
    console.log(teacher)
    teacher.drivAccess = teacher.credentials !== undefined ? true : false;


    teacher.credentials = undefined;
    res.status(200).json({ teacher });
});
app.get('/credentials/teacher/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tokens = await getValidAccessToken(id)
        if (!tokens) {
            res.sendStatus(400).json({ "message": "failed to get the tokens" })
        }
        const teacher = await getTeacher(id)
        res.json({ "accessToken": tokens , "teacher_drive" : teacher.drive })
    } catch (e) {
        res.status(400).json({ "message": e })
    }
});

app.get('/assignment/teacher/:id',async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{

        const assignment = await assignmentController.getAssignmentList(id)
        res.json(assignment)
    }catch(e){
        res.json({"message" :"Error : " + e})

    }
})
app.get('/all/',async(req,res)=>{
 const all =await getBranchYearSubject()
 res.json(all)
})
//student routes
app.post('/student/create', checkValidSignupStudent, async (req, res) => {
    const studentData = req.body;

    const userData = {
        uid: studentData.uid,
        name: studentData.name,
        email: studentData.email,
        role: 'student',
        branchId: studentData.branchId,
        sectionId: studentData.sectionId,
        yearId: studentData.yearId,
        driveAccessToken: null,
        createdAt: Timestamp.now()
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
    const students = await studentList('all', year, branch);
    res.status(200).json(students);
});
app.get('/student/:crt', async (req, res) => {
    const { crt } = req.params;
    const student = await getStudentByEmail(crt);
    res.status(200).json({ student });
});
app.post('/teacher/credentials/', async (req, res) => {
    const { id, accessToken, refreshToken, scope } = req.body;

    // Ensure uid, accessToken, refreshToken, and scope are present
    if (!id || !accessToken || !refreshToken || !scope) {
        return res.status(400).send({ status: 'Missing required data' });
    }

    try {
        // Call the function to update credentials
        const isDone = await updateCredentials(id, accessToken, refreshToken, scope);

        // Send response based on whether the update was successful
        if (isDone) {
            res.status(200).send({ status: 'Credentials updated successfully' });
        } else {
            res.status(500).send({ status: 'Failed to update credentials' });
        }
    } catch (err) {
        console.error("Error while updating credentials:", err);
        res.status(500).send({ status: 'Error updating credentials', error: err.message });
    }
});


//server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});