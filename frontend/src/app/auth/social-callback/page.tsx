"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Session cookie has already been set by the backend via httpOnly cookie.
    // Clean URL query parameters and redirect to chat or target destination
    let target = "/message";
    if (typeof window !== "undefined") {
      const cleaned = new URL(window.location.href);
      const redirectParam = cleaned.searchParams.get("redirectTo");
      if (
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("/auth") &&
        redirectParam !== "/"
      ) {
        target = redirectParam;
      }
      cleaned.searchParams.delete("accessToken");
      cleaned.searchParams.delete("refreshToken");
      cleaned.searchParams.delete("redirectTo");
      window.history.replaceState(
        {},
        document.title,
        cleaned.pathname + cleaned.search + cleaned.hash,
      );
    }

    router.replace(target);
  }, [router]);

  return null;
}
