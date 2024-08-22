import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser } from "@/api/api";
import bcrypt from 'bcryptjs'; 

export const authOptions:AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
              },
           

  async authorize(credentials) {
    const { email, password } = credentials;
    console.log('email pass', email, password);
    try {
      // Call the verifyUser API to fetch the user by email
      const user = await verifyUser(credentials.email, credentials.password);
  
      // If user is found, verify the password using bcrypt
      if (user) {
        const passwordsMatch = await bcrypt.compare(password, user.password);
  
        if (passwordsMatch) {
          // If passwords match, return the user object
          return user;
        }
      }
  
      // If user is not found or passwords don't match, return null
      return null;
    } catch (error) {
      console.log("Error: ", error);
      return null; // Returning null will fail the authorization
    }
  },

        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 1*24*60*60,
    },
    jwt: {},
    callbacks: {
        // async jwt(token, user, account, profile, isNewUser) {
        //     if (user) {
        //         token.id = user.id;
        //         token.name = user.name;
        //         token.email = user.email;
        //     }
        //     return token;
        // },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn:"/",
    }
    
}