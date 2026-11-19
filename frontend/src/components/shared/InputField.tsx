"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  togglePassword?: boolean;
}

export default function InputField({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  togglePassword = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && togglePassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name} className="text-xs font-medium text-foreground/85 tracking-wide">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-10 rounded-lg bg-card/60 border-border/70 text-foreground placeholder:text-muted-foreground/50 text-sm transition-all duration-150 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 ${
            isPasswordField && togglePassword ? "pr-10" : ""
          } ${error ? "border-destructive/80 focus-visible:ring-destructive/20" : ""}`}
        />
        {isPasswordField && togglePassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-xs font-medium mt-1">{error}</p>}
    </div>
  );
}
