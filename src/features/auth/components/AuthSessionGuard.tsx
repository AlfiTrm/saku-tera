"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthState, readAuthSession } from "@/src/features/auth/lib/auth-storage";
import { subscribeAuthInvalidated } from "@/src/features/auth/lib/auth-events";

function isPublicPath(pathname: string) {
  return pathname.startsWith("/login") || pathname.startsWith("/onboard");
}

export function AuthSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname || isPublicPath(pathname)) {
      return;
    }

    function redirectToLogin() {
      clearAuthState();
      router.replace("/login");
    }

    const session = readAuthSession();

    if (!session?.accessToken) {
      redirectToLogin();
      return;
    }

    return subscribeAuthInvalidated(redirectToLogin);
  }, [pathname, router]);

  return null;
}
