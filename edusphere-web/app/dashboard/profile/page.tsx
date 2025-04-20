"use client";

import { ProfileIcon } from "@/components/Layouts/header/user-info/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface userDataTypes {
  name: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  driveAccess: boolean;
}

export default function Profile() {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);

  const [userdata, setUserdata] = useState<userDataTypes>({
    name: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    driveAccess: false,
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `https://enabled-flowing-bedbug.ngrok-free.app/teacher/${session?.user.id}`
      );

      if (response.ok) {
        const body = await response.json();
        setUserdata({
          name: body.teacher.name,
          email: body.teacher.email,
          address: body.teacher.address,
          driveAccess: body.teacher.drivAccess,
          phone: body.teacher.phone,
          gender: body.teacher.gender,
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const handleConnectDrive = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const scope = encodeURIComponent("https://www.googleapis.com/auth/drive");
    const state = encodeURIComponent(session?.user?.id || "xyz123");

    const oauthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}`;

    window.location.href = oauthUrl;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1000px] mx-auto p-10 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1000px] mx-auto p-10 text-center">
        <p className="text-red-600">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-gray-100 p-4 rounded-lg flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">
          Hello, {userdata.name.toUpperCase()}
        </h1>
        <p className="text-gray-500 mb-4">Welcome to your profile page</p>

        <div className="flex flex-col items-center justify-center">
          {/* Profile Icon */}
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
            <ProfileIcon />
          </div>

          {/* Profile Info */}
          <div className="text-gray-500 mb-2">{userdata.name}</div>
          <div className="text-gray-500 mb-2">{userdata.email}</div>
          <div className="text-gray-500 mb-2">{userdata.phone}</div>
          <div className="text-gray-500 mb-2">{userdata.address}</div>
          <div className="text-gray-500 mb-4">{userdata.gender}</div>

          {/* Drive Connection Status */}
          <div className="text-gray-500 mb-4">
            {userdata.driveAccess ? "✅ Drive Connected" : "❌ Drive Not Connected"}
          </div>

          {/* Connect Drive Button */}
          {!userdata.driveAccess && (
            <button
              onClick={handleConnectDrive}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Connect Drive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
