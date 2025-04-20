// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // custom field to determine signup or login
      },
      async authorize(credentials: any) {
        const { email, password, action } = credentials;

        if (!email || !password) return null;

        try {
          let userCredential: UserCredential;
          let signInData = { "address": '', "phone": '', 'gender': '' , 'name' : '' };

          if (action === "signup") {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);


          } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
            const response = await fetch(`https://enabled-flowing-bedbug.ngrok-free.app/teacher/${userCredential.user.uid}`,)
            // console.log(await response.json())
            // const data = await response.body;
            if (response.ok) {
              const parseData = await response.json()
              console.log("parsedData : " + parseData['teacher']['address'])
              signInData.address = parseData['teacher']['address'];
              signInData.phone = parseData['teacher']['phone'];
              signInData.gender = parseData['teacher']['gender'];
              signInData.name = parseData['teacher']['name'];
            }
            else {
              return null;
            }
          }

          if (userCredential.user !== null) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || signInData.name ||  "Firebase User",
              'phone': signInData.phone,
              'gender': signInData.gender,
              'address': signInData.address
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth", // your login/signup page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.gender = user.gender;
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.uid;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.gender = token.gender;
        session.user.address = token.address;
      }
      return session;
    }
    ,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };