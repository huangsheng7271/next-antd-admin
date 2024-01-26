"use client";
import React, {useEffect} from "react";
import { useRouter } from 'next/navigation'
const AuthWrapper = ({children,}: { children: React.ReactNode; }) => {
    const router = useRouter();
    let isAuth = true;
    useEffect(() => {
        console.log('AuthWrapper..............')
        //router.push('/login');

    })

    return isAuth ? <div>{children}</div> : null;
}

export default AuthWrapper;