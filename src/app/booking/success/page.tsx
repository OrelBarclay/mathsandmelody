"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Booking Successful!
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Thank you for booking with us. We&apos;ll send you a confirmation email shortly.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[600px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Payment Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Your session has been booked successfully. We&apos;ll send you a confirmation email with all the details.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/dashboard">View Booking Details</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 