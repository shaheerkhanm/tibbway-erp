import { AppointmentsCalendar } from "@/components/appointments-calendar"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage and track appointments information</p>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </header>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AppointmentsCalendar />
      </Suspense>
    </div>
  )
}
