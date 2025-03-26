"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Create an Account
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Sign up to start booking sessions with us.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[400px]">
          <Card>
            <CardHeader>
              <CardTitle>Join Us</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthForm mode="signup" />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 