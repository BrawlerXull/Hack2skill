"use client"

import './globals.css'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next';

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from 'next/navigation'
import Image from 'next/image';
import { Button } from '@/components/ui/button'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { JokeOfTheDay } from '@/components/joke-of-the-day'
import { Toaster } from 'sonner';
import Sidebar from '@/components/side-bar';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // const {connectWallet} = useWalletLogin();
  // useEffect(()=>{
  //   connectWallet();
  // })

  return (
    <Provider store={store}>
      <ClerkProvider >
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} min-h-screen bg-cover bg-center`} >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <div className="container mx-auto h-full ">
                  <Sidebar>{children}</Sidebar>;
                    <Analytics />
                  </div>
                </main>

                {/* <footer className="py-6 md:px-8 md:py-0">
                  <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Built with care by Phenias and Ferb. Always seek professional help in crisis situations.
                    </p>
                  </div>
                </footer> */}
              </div>
              <JokeOfTheDay />
            </ThemeProvider>
          </body>
          <Toaster />
        </html>
      </ClerkProvider>
    </Provider>
  )
}
