"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/components/custom/auth/LoginForm";
import SignUpForm from "@/components/custom/auth/SignUpForm";
import GoogleOAuth from "@/components/shared/GoogleOAuth";
import GitHubOAuth from "@/components/shared/GitHubOAuth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { useUserStore } from "@/store/userStore";

export default function AuthPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      const redirectParam = searchParams?.get("redirectTo");
      const target =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("/auth") &&
        redirectParam !== "/"
          ? redirectParam
          : "/message";
      router.replace(target);
    }
  }, [user, router, searchParams]);

  const {
    isLogin,
    setIsLogin,
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    loading,
  } = useAuthForm();

  return (
    <div className="flex flex-col justify-center text-foreground w-full max-w-sm mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>

      {/* Render Login or SignUp */}
      {isLogin ? (
        <LoginForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <SignUpForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 border-t border-border/70" />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">or</span>
        <div className="flex-1 border-t border-border/70" />
      </div>

      {/* Social Logins */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <GoogleOAuth />
        </div>
        <div className="flex-1">
          <GitHubOAuth />
        </div>
      </div>
    </div>
  );
}
