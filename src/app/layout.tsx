import React from 'react';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '../lib/AntdRegistry';
import Providers from '../lib/providers'
import './globals.css';
import AuthWrapper from "@/lib/AuthWrapper";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'sharedgpt admin',
  description: 'sharedgpt admin',
};


const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={inter.className}>
            <StyledComponentsRegistry>
                <Providers>
                    {children}
                </Providers>
            </StyledComponentsRegistry>
        </body>
    </html>
);

export default RootLayout;