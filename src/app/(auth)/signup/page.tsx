// src/app/(auth)/signup/page.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function SignupPage() {
  // Placeholder for signup logic (e.g., Firebase Auth)

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]"> {/* Adjust height */}
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           {/* Optional: Add fields like First Name, Last Name if needed */}
          {/* <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="Max" required />
          </div> */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           {/* Optional: Add Confirm Password field */}
           {/* <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div> */}
          <Button type="submit" className="w-full">
            Create an account
          </Button>
           {/* Optional: Add social signups */}
          {/* <Button variant="outline" className="w-full">Sign up with Google</Button> */}
        </CardContent>
         <CardFooter className="flex flex-col items-center text-center text-sm">
           <p className="text-muted-foreground">
             Already have an account?{' '}
             <Link href="/login" className="underline hover:text-primary">
               Login
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
