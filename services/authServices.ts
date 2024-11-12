import prisma from "@/lib/prisma";

interface OTPVerificationParams {
  phone: string;
  otp: string;
}

export const verifyOTP = async ({ phone, otp }: OTPVerificationParams) => {
  const devPhoneNumbers = ["8433087200", "7810028486", "8838505984", "9080745346"];
  const devOtp = "111222";

  try {
    // For development testing
    if (devPhoneNumbers.includes(phone) && otp === devOtp) {
      const user = await prisma.user.findUnique({
        where: { phone },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }

    // For production: Implement actual OTP verification logic here
    throw new Error("Invalid OTP");
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};