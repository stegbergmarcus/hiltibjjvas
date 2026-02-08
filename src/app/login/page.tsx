"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoginClient = dynamic(() => import("./LoginClient").then(mod => mod.LoginClient), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
    )
});

export default function LoginPage() {
    return <LoginClient />;
}
