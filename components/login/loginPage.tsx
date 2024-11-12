"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";


export default function Login() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP

  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOTP(true);
    try {
      const devPhoneNumbers = ["8433087200", "7810028486", "8838505984", "9080745346"];
      
      if (devPhoneNumbers.includes(phoneNumber)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("OTP sent successfully");
        setStep(2);
      } else {
        toast.error("Invalid phone number");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    setIsVerifyingOTP(true);
    
    try {
      const result = await signIn("credentials", {
        phone: phoneNumber,
        otp: otpString,
        callbackUrl:"/dashboard"
      });

      if (result?.error) {
        if (result.error.includes("Unauthorized")) {
          toast.error("Access denied: Admin only");
        } else {
          toast.error("Invalid OTP or login failed");
        }
        return;
      }

      if (result?.ok) {
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to verify OTP or login");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (step === 2) {
      otpInputs.current[0]?.focus();
    }
  }, [step]);

  useEffect(() => {
    // Only proceed if we have a definitive session status
    if (sessionStatus !== 'loading') {
      // If user is authenticated, redirect to dashboard immediately
      if (sessionStatus === 'authenticated' && session) {
        // Using replace instead of push to prevent adding to history stack
        router.replace('/dashboard');
      }
    }
  }, [sessionStatus, session, router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Column - Static Content */}
      <div className="md:w-1/2 bg-indigo-800 p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
              Welcome to SETU Admin
            </h2>
            <p className="text-xl text-gray-200">
              Connect, Grow, and Support your veteran network
            </p>
          </div>
        </div>
      </div>
      {/* Right Column - Login Form */}
      <div className="md:w-1/2 p-8 flex flex-col items-center justify-center">
        <Image
          src="/setu.svg"
          alt="SETU Logo"
          width={200}
          height={60}
          className="mb-8"
        />
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-indigo-900">
                  Welcome Back!
                </h1>
                <p className="text-gray-600">
                  Sign in to your SETU Admin account
                </p>
              </div>
              {step === 1 ? (
                <form
                  key="phone-form"
                  onSubmit={handlePhoneSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out flex items-center justify-center"
                    disabled={isSendingOTP}
                  >
                    {isSendingOTP ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form
                  key="otp-form"
                  onSubmit={handleOtpSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter OTP
                    </label>
                    <div className="flex justify-between space-x-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el: HTMLInputElement | null) => {
                            if (el) {
                              otpInputs.current[index] = el;
                            }
                          }}
                          type="text"
                          maxLength={1}
                          className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          required
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out flex items-center justify-center"
                    disabled={isVerifyingOTP}
                  >
                    {isVerifyingOTP ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify OTP
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
              <p className="mt-4 text-sm text-center text-gray-500">
                <Link
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}