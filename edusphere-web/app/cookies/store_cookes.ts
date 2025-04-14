import { cookies as getServerCookies } from "next/headers"; // <-- Renamed to avoid conflict

export const storeCookies = async ( email : string, uid : string, name : string, phone : string, address : string, gender : string) => {
    const cookies = await getServerCookies();
    cookies.set("app_auth_cert", "linmar_dev_crt_teacher");
    cookies.set("email", email);
    cookies.set("uid", uid);
    cookies.set("name", name);
    cookies.set("phone", phone);
    cookies.set("address", address);
    cookies.set("gender", gender);
}

export const getCookies = async () => {
    const cookies = await getServerCookies();
    return {
        app_auth_cert: cookies.get("app_auth_cert"),
        email: cookies.get("email"),
        uid: cookies.get("uid"),
        name: cookies.get("name"),
        phone: cookies.get("phone"),
        address: cookies.get("address"),
        gender: cookies.get("gender"),
    }
}