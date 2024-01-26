'use client';
import {useEffect} from "react";
import { useRouter } from 'next/navigation'

export default function LoginPage(){
    const router = useRouter();

    useEffect(() => {
        console.log("LoginPage.....")
    });

    return <h1>Login Page</h1>;

};



