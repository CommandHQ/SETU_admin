"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function Login() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // Fix: Properly type the refs array
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
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
        redirect: false,
        callbackUrl: "/dashboard"
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
    if (sessionStatus !== 'loading' && sessionStatus === 'authenticated' && session) {
      toast.error("You're already authenticated");
      router.replace('/dashboard');
    }
  }, [sessionStatus, session, router]);

  // Features list for the left panel
  const features = [
    { icon: CheckCircle, text: "Secure Authentication" },
    { icon: CheckCircle, text: "Real-time Updates" },
    { icon: CheckCircle, text: "Seamless Access" }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-200/20 bg-[size:20px_20px] opacity-100" />
      </div>

      {/* Left Column - Static Content */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-800 to-purple-900 p-8 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Animated shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="w-full max-w-md space-y-8 flex flex-col items-center relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              Welcome to SETU Admin
            </h2>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Connect, Grow, and Support your veteran network with our secure platform
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="md:w-1/2 p-8 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border-0 relative">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {step === 1 ? "Sign In" : "Verify OTP"}
                </h1>
                <p className="text-gray-600">
                  {step === 1 
                    ? "Enter your phone number to continue" 
                    : "Enter the verification code sent to your phone"}
                </p>
              </div>

              {step === 1 ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-indigo-600 transition-colors" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white group-hover:shadow-md"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                    disabled={isSendingOTP}
                  >
                    {isSendingOTP ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <div className="flex justify-between space-x-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          // Fix: Properly type the ref callback
                          ref={el => {
                            otpInputs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          className="w-12 h-14 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                    disabled={isVerifyingOTP}
                  >
                    {isVerifyingOTP ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    ← Back to phone number
                  </button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}