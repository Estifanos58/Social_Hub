"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "../../shared/InputField";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

interface LoginFormProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function LoginForm({
  formData,
  errors,
  handleChange,
  handleSubmit,
  loading,
}: LoginFormProps) {
  const navigate = useRouter();

  return (
    <form className="space-y-4 text-foreground" onSubmit={handleSubmit}>
      <InputField
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <InputField
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        togglePassword
      />

      {/* Forgot Password link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate.push("/auth/resetpassword")}
          className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Sign In
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
