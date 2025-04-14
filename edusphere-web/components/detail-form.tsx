"use client"
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
interface DetailsFormProps {
  email: string;
  uid : string;
}

export default function DetailsForm({ email, uid }: DetailsFormProps) {
  const [formData, setFormData] = useState({ name: "", email: email, phone: "", address: "", gender: "Male" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "", phone: "", address: "", gender: "Male  " });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const {name, email,phone,address,gender} = formData;

    e.preventDefault();

    try {
      const res = await fetch( "https://enabled-flowing-bedbug.ngrok-free.app/teacher/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({app_auth_cert : "linmar_dev_crt_teacher", email,name,phone,address,uid,gender}),
      });

      if (res.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending data.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-center text-2xl font-bold text-black">Complete your details</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setFormErrors(prev => ({ ...prev, email: "" }));
                  }}
                />
                {formErrors.email && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </div>
              <label htmlFor="name" className="my-2 block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <div className="my-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setFormErrors(prev => ({ ...prev, name: "" }));
                  }}
                />
                {formErrors.email && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </div>
              {/* Gender Toggle Tab button */}
              <label htmlFor="gender" className="mt-2 block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="flex gap-4 my-2 justify-evenly items-center" >
                <div className={`border border-gray-300 rounded-md px-3 py-2 w-1/2 ${formData.gender === "Male" ? "bg-indigo-500 text-white" : ""}`} onClick={()=>setFormData(prev => ({ ...prev, gender: "Male" }))}>Male</div>
                <div className={`border border-gray-300 rounded-md px-3 py-2 w-1/2 ${formData.gender === "Female" ? "bg-indigo-500 text-white" : ""}`} onClick={()=>setFormData(prev => ({ ...prev, gender: "Female" }))}>Female</div>
              </div>
            
              <label htmlFor="phone" className="my-2 block text-sm font-medium text-gray-700">
                Your Phone Number
              </label>
              <div className="my-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setFormErrors(prev => ({ ...prev, phone: "" }));
                  }}
                />
                {formErrors.phone && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {formErrors.phone}
                  </motion.p>
                )}
              </div>
              <label htmlFor="address" className="my-2 block text-sm font-medium text-gray-700">
                Your Address
              </label>
              <div className="my-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.address ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }));
                    setFormErrors(prev => ({ ...prev, address: "" }));
                  }}
                />
                {formErrors.address && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {formErrors.address}
                  </motion.p>
                )}
              </div>
            </div>
            <div>
         
            </div>
          </div>

      

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
               "Submit"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
