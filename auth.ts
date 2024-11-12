import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import prisma from "./lib/prisma";
import { AdapterUser } from "next-auth/adapters";


interface CustomUser {
  id: string;
  token: string;
  name:string,
  role:string,
  phone:string,
  image:string,

}

export const authOptions: NextAuthOptions = {
  
  adapter: PrismaAdapter(prisma),
  secret:process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "PhoneOTP",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
       try{
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Phone and OTP are required");
        }

        const devPhoneNumbers = ["7997832662","8433087200", "7810028486", "8838505984", "9080745346"];
        const devOtp = "111222";

        const isDevUser = devPhoneNumbers.includes(credentials.phone);
        const isValidDevOtp = credentials.otp === devOtp;

        if(isDevUser && isValidDevOtp){
          const user = await prisma.user.findUnique({
            where:{ phone : credentials.phone},
            select:{
              id: true,
              firstName:true,
              lastName:true,
              role:true,
              phone:true,
              image:true,
            },
          });

          if(!user){
            throw new Error("user not found");
          }

          if (user.role !== "admin") {
            throw new Error("Unauthorized access");
          }

          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            phone: user.phone,
            image:user.image,
            token: '',
          };
        }
        throw new Error("Invalid credentials");
      }catch(error){
          console.error("Authorization error:",error);
          return null;
      }
    },    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
        token.name = user.name;
        token.phone = (user as CustomUser).phone;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role=token.role;
        session.user.name=token.name;
        session.user.phone = token.phone;
        session.user.image = token.image;
        }
      return session;
    },
  },
};
