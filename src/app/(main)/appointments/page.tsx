import { AppointmentsCalendar } from "@/components/appointments-calendar"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AppointmentsCalendar />
      </Suspense>
    </div>
  )
}
