"use client"
import AddAssignmentForm from "@/components/assignment-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AssignmentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const {data : session} = useSession()

  const fetchAssignments = async () => {
    const res = await fetch("https://enabled-flowing-bedbug.ngrok-free.app/assignment/teacher/"+session?.user?.id,); // example endpoint
    const data = await res.json();
    setAssignments(data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📚 Assignments</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          ➕ Add Assignment
        </button>
      </div>

      {/* Assignment List */}
      {assignments.length > 0 && (
      <div className="space-y-4">
        
        {assignments.map((item) => (
          <div key={item['id']} className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-xl font-semibold">{item['title']}</h2>
            <p className="text-sm text-gray-600">{item['description']}</p>
            <p className="text-sm mt-1 text-gray-500">
              📅 Due: {new Date(item['dueDate']).toLocaleDateString()}
            </p>
            {/* You can add branch, year, section here too */}
          </div>
        ))}
      </div>
)}
      {/* Assignment Form Modal */}
      {showForm && (
        <AddAssignmentForm 
          onClose={() => {
            setShowForm(false);
            fetchAssignments();
          }} 
        />
      )}
    </div>
  );
}
