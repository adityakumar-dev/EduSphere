import { createUserWithEmailAndPassword } from "firebase/auth";

interface TeacherProfile{
    name: string;
    email: string;
    uid: string;
    gender: string;
    phone: string;

}
class ServerEndpoints{
    static _baseUrl = "https://enabled-flowing-bedbug.ngrok-free.app";
    static createTeacherProfile = `${this._baseUrl}/teacher/create`;
    static getTeacherProfile = `${this._baseUrl}/teacher/get`;

    static setTeacherProfile = (teacherData: TeacherProfile) => {
        return fetch(`${this.createTeacherProfile}`, {
            method: "POST",
            body: JSON.stringify(teacherData),
        });
    }
}

export default ServerEndpoints;