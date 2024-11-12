import * as z from "zod";

export const phoneNumberValidation = z.object({
  phone_no: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(10, "Enter a valid phone number"),
});

export const otpValidation = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must only contain numbers"),
});