"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailForm } from "@/hooks/auth/useVerifyEmailForm";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const {
    codes,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    loading,
    inputRefs,
  } = useVerifyEmailForm();

  return (
    <div className="flex flex-col justify-center text-foreground w-full max-w-sm mx-auto">
      <div className="mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Enter Verification Code
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          We&apos;ve sent a 6-digit confirmation code to your registered email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code}
              placeholder="•"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-11 h-13 text-center text-lg font-bold font-mono border border-border/80 rounded-xl bg-secondary/50 text-foreground placeholder:text-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 text-xs"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying code...
            </span>
          ) : (
            "Verify & Continue"
          )}
        </Button>
      </form>

      <div className="mt-6 text-xs text-muted-foreground text-center">
        Didn’t get a code?{" "}
        <button
          type="button"
          className="text-primary font-semibold hover:underline cursor-pointer"
          onClick={() => toast.info("📩 Resend code feature coming soon")}
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
