/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Suspense } from "react"
import { ClientBookingDetails } from "./client-booking-details"

type PageParams = {
  params: {
    id: string
  }
}

// @ts-ignore
export default function Page(props: PageParams) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientBookingDetails bookingId={props.params.id} />
    </Suspense>
  )
} 