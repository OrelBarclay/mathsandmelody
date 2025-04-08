import { Suspense } from "react";
import { ClientBookingDetails } from "./client-booking-details";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientBookingDetails bookingId={id} />
    </Suspense>
  );
}