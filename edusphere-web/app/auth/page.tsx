"use client";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "../firebase/config";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import DetailsForm from "@/components/detail-form";
import NextAuth from "next-auth";
import { getSession, signIn } from "next-auth/react";
import { sign } from "crypto";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [uid, setUid] = useState("");
const [isSignUp, setIsSignUp] = useState(true);
  useEffect(() => {
    // Check for saved email/password if remember me was previously checked
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }


    setFormErrors(errors);
    return isValid;
  };
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  
  if (!validateForm()) {
    return;
  }
  try{
    setIsLoading(true);
    // first check firbase init using auth app
    if(!auth){
      setError("Firebase is not initialized.");
      return;
    }
    

    const  res = await signIn("credentials", {
      email: email,
      password: password,
      action: "signup",
      redirect: false,
    }) as {
      ok: boolean;
      error: string;
      status: number;
      url: string;
    };
    console.log(res);
    if(res.ok){
      console.log(res);
      const session = await getSession();
      if(session){
        
        // session.
      setUid( (session.user as any).id);
      console.log(session.user)
      console.log(session.expires)
      console.log(uid)
      setShowDetailsForm(true);
      }

    
    }else{
      setError("An error occurred with sign up.");
    }
    // const token = await user.getIdToken();
    
    
  }catch(error: any){
    console.error(error);
    setError(error.message || "An error occurred with sign up.");
  }finally{
    setIsLoading(false);
  }
}
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const  res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      }) as {
        ok: boolean;
        error: string;
        status: number;
        url: string;
      };
      if(res.ok){
        const session = await getSession();
        if(session){
          
          // session.
        setUid( (session.user as any).id);
        console.log(session.user)
        console.log(session.expires)
        console.log(uid)
        console.log((session.user as any).phone)
        router.push("/dashboard")

        }
    }
      // const token = await user.getIdToken();
      // const userData = await firebaseDatabase.getTeacherProfile(user.uid);
      // userData
      
    
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //     router.push("/dashboard");
  //   } catch (error: any) {
  //     console.error(error);
  //     setError(error.message || "An error occurred with Google login.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
 showDetailsForm ? <DetailsForm email={email} uid={uid} /> : <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to EduSphere
          </h2>
          <div className="py-4"></div>
          {/* sign in sign up toggle */}
          <div className="flex items-center justify-center">
            {/* toggle background color */}
            <button className={`w-1/2 py-2 px-4 rounded-md  text-white ${isSignUp ? 'bg-indigo-600' : 'bg-gray-300'}`}  onClick={() => setIsSignUp(true)}>Sign Up</button>
            <div className="px-2"></div>
            <button className={`w-1/2 py-2 px-4 rounded-md  text-white ${!isSignUp ? 'bg-indigo-600' : 'bg-gray-300'}`} onClick={() => setIsSignUp(false)}>Sign In</button>
          </div>
          {/* sing in and sign up  */}
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isSignUp ? handleSignUp : handleEmailLogin}>
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
                    setEmail(e.target.value);
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
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormErrors(prev => ({ ...prev, password: "" }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-500 hover:text-gray-700">
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
                {formErrors.password && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {formErrors.password}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
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
               isSignUp ? "Sign up" : "Sign in" 
              )}
            </motion.button>
          </div>
        </form>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </motion.button>
          </div>
        </div> */}
      </motion.div>
    </div>
  );
}