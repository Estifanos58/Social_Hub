"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import Link from "next/link";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const {
    step,
    formData,
    errors,
    handleChange,
    handleEmailSubmit,
    handleResetSubmit,
    sending,
    resetting,
  } = useResetPassword();

  return (
    <div className="flex flex-col justify-center text-foreground w-full max-w-sm mx-auto">
      <Link
        href="/auth"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>

      {step === "email" ? (
        <>
          <div className="mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Forgot Password
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your email address and we’ll send you a 6-digit verification code.
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <InputField
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 text-xs"
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending code...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Set New Password
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter the 6-digit code sent to <b className="text-foreground">{formData.email}</b> and set your new password.
            </p>
          </div>
          <form onSubmit={handleResetSubmit} className="space-y-3.5">
            <InputField
              name="code"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
            />
            <InputField
              name="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              togglePassword
            />
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              togglePassword
            />
            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 text-xs mt-2"
              disabled={resetting}
            >
              {resetting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting password...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
