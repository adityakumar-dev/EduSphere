import { storeCookies } from "@/app/cookies/store_cookes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default function Process(name : string, email : string, phone : string, address : string, gender : string, uid : string) {

    storeCookies(email,uid,name,phone,address,gender)
    setTimeout(() => {
        redirect("/dashboard")
    }, 1000);
return <div className="flex flex-col items-center justify-center h-screen">
    <div className="w-1/2 h-1/2 bg-gray-200 rounded-full"></div>
   </div>;
}