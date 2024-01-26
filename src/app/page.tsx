'use client';
import './globals.css';
import {useEffect} from "react";
import { useRouter } from 'next/navigation'

export default function HomePage(){
    const router = useRouter();

    useEffect(() => {
         router.push('/login');
    });

    return null;

};



