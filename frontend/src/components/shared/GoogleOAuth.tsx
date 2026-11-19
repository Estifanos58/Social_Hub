"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleOAuth() {
  const handleGoogleOAuth = () => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/graphql\/?$/, "")
        : "http://localhost:5000");
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleOAuth}
      className="flex w-full h-10 items-center justify-center gap-2 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary text-foreground text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs"
    >
      <FcGoogle size={18} />
      <span>Google</span>
    </button>
  );
}

export default GoogleOAuth;
