import { useForm } from "react-hook-form";

export default function FormDialog(email : string){
    const { register, handleSubmit } = useForm();
    return (
        <div>
            <h1>Form Dialog</h1>
        </div>
    )
}