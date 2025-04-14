"use client"
import { useSession, } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      console.log("Session:", session);
      setUserData(session?.user);
    }
  }, [session, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold">Welcome, {userData?.name}</h1>
      <p>Email: {userData?.email}</p>
      <p>User ID: {userData?.id}</p>
      <p>User Phone : {userData?.phone}</p>
      <p>Gender: {userData?.gender}</p>
      <p>Address: {userData?.address}</p> */}
    </div>
  );
}
