"use client"

import { ReactElement } from 'react'

export interface BookingDetailsProps {
  bookingId: string
}

export function BookingDetails({ bookingId }: BookingDetailsProps): ReactElement {
  return <div>Booking Details for {bookingId}</div>
} 