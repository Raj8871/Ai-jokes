// src/app/(auth)/login/page.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function LoginPage() {
  // Placeholder for login logic (e.g., Firebase Auth)

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
             <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* Optional: Add Forgot Password link */}
                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
                </Link> */}
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {/* Optional: Add social logins or other auth methods */}
          {/* <Button variant="outline" className="w-full">Login with Google</Button> */}
        </CardContent>
         <CardFooter className="flex flex-col items-center text-center text-sm">
           <p className="text-muted-foreground">
             Don't have an account?{' '}
             <Link href="/signup" className="underline hover:text-primary">
               Sign up
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
