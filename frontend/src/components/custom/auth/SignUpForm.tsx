"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InputField from "../../shared/InputField";
import { Loader2, ArrowRight } from "lucide-react";

interface SignUpFormProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SignUpForm({
  formData,
  errors,
  handleChange,
  setFormData,
  handleSubmit,
  loading,
}: SignUpFormProps) {
  return (
    <form className="space-y-3.5 text-foreground" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          name="firstname"
          label="First Name"
          placeholder="John"
          value={formData.firstname}
          onChange={handleChange}
          error={errors.firstname}
        />

        <InputField
          name="lastname"
          label="Last Name"
          placeholder="Doe"
          value={formData.lastname}
          onChange={handleChange}
          error={errors.lastname}
        />
      </div>

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

      {/* Terms */}
      <div className="flex items-center space-x-2 pt-1">
        <Checkbox
          name="terms"
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked: boolean) =>
            setFormData((prev: any) => ({
              ...prev,
              terms: checked,
            }))
          }
          className="rounded-md border-border/80"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer select-none">
          I agree to the{" "}
          <span className="text-primary hover:underline font-medium">
            Terms & Privacy Policy
          </span>
        </label>
      </div>
      {errors.terms && (
        <p className="text-destructive text-xs">{errors.terms}</p>
      )}

      <Button
        type="submit"
        className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 cursor-pointer mt-2"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
