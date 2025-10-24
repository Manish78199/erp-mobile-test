'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const User = {
    role: "SUBADMIN"
}

export default function ProtectedLayout({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: Array<String> }) {
    const router = useRouter();

    useEffect(() => {
        if (!User || !allowedRoles.includes(User?.role)) {
            router.push("/school-admin")
        }


    }, [router]);

    return <>{children}</>;
}
