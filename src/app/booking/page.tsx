"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { BookingForm } from "@/components/booking/booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Book a Session
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Choose your service and schedule a session with us.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[600px]">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Session</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 