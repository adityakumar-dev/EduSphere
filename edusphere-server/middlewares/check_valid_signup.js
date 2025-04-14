const checkValidSignupStudent = async (req, res, next) => {
    const {app_auth_cert} = req.body;
    console.log(app_auth_cert);
    console.log(req.body);
    console.log(process.env.APP_AUTH_CRT);
    if(app_auth_cert !== process.env.APP_AUTH_CRT){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
const checkValidSignUpTeacher = async (req, res, next) => {
    const {app_auth_cert} = req.body;
    console.log(req.body);
    console.log(process.env.APP_AUTH_CRT_TEACHER);
    if(app_auth_cert !== process.env.APP_AUTH_CRT_TEACHER){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export { checkValidSignupStudent, checkValidSignUpTeacher };