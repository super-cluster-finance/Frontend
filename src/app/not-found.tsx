"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
export default function NotFound() {
  // history back button
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full text-center">
        {/* Error Details Card */}
        <Image
          src="/404.png"
          alt="404 Not Found"
          width={320}
          height={320}
          className="mx-auto"
        />
        {/* Action Buttons */}
        <div className="flex w-full mb-6 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex flex-row items-center gap-2 border cursor-pointer border-white/10 text-sm py-3 px-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white md:text-lg font-normal rounded transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}
