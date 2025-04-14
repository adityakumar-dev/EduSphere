import Navbar from "@/components/navbar";
import Image from "next/image";// <-- Renamed to avoid conflict
import { redirect } from "next/navigation";
export default function Home() {

  return (
    <>
      <Navbar />
      {/* You can now safely use userCookies */}
    </>
  );
}
