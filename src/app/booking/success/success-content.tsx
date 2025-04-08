"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"

export function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setError("No session ID found")
          setLoading(false)
          return
        }

        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) throw new Error("Payment verification failed")
        setLoading(false)
      } catch (err) {
        console.error("Error verifying payment:", err)
        setError(err instanceof Error ? err.message : "Payment verification failed")
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  if (loading) {
    return (
      <MainLayout>
        <div className="container flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Verifying your payment...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter text-red-500 md:text-5xl lg:leading-[1.1]">
              Payment Error
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              {error}
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Booking Successful!
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Thank you for choosing Math & Melody Academy.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[600px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Your booking has been confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>
                We&apos;ll send you a confirmation email with the details of your booking.
                You can also view your booking in your dashboard.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 