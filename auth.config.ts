import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"

// Define custom types
interface CustomUser {
  id: string;
  token: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role?: string;
}

interface CustomJWT {
  id: string;
  accessToken: string;
  role: string;
}

interface CustomSession {
  user: {
    id: string;
    role: string;
    accessToken: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Define a custom configuration type
interface CustomAuthConfig {
  providers: any[];
  callbacks: {
    jwt: (params: { token: CustomJWT; user: CustomUser | null }) => Promise<CustomJWT>;
    session: (params: { session: CustomSession; token: CustomJWT }) => Promise<CustomSession>;
  };
  pages: {
    signIn: string;
    signOut: string;
    error: string;
  };
  session: {
    strategy: "jwt";
    maxAge: number;
  };
  secret: string | undefined;
}

// Mock function to simulate OTP verification
const mockVerifyOTP = async ({ phone, otp }: { phone: string; otp: string }) => {
  if (otp === "111222") {
    return {
      data: {
        token: jwt.sign({ id: phone, role: "user" }, process.env.JWT_SECRET || ''),
      },
    };
  }
  throw new Error("Invalid OTP");
};

const authConfig: CustomAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "PhoneOTP",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        try {
          const response = await mockVerifyOTP({
            phone: credentials.phone,
            otp: credentials.otp,
          });

          if (response.data?.token) {
            const decodedToken = jwt.decode(response.data.token) as {
              id: string;
              role: string;
            } | null;

            if (!decodedToken) {
              return null;
            }

            return {
              id: decodedToken.id,
              token: response.data.token,
              name: null,
              email: null,
              image: null,
            };
          }
        } catch (error) {
          console.error("OTP verification error:", error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomJWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.token,
          role: "user",
        };
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          accessToken: token.accessToken,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;