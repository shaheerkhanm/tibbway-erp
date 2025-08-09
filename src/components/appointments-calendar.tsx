"use client"

import * as React from "react"
import { addDays, format, isSameDay } from "date-fns"
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react"

import type { Appointment } from "@/lib/types"
import { mockAppointments } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppointmentForm } from "./appointment-form"
import { ScrollArea } from "./ui/scroll-area"

export function AppointmentsCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = React.useState<Appointment[]>(mockAppointments)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const selectedDayAppointments = React.useMemo(() => {
    return date
      ? appointments.filter((appt) => isSameDay(appt.appointmentDate, date))
      : []
  }, [date, appointments])

  const handleFormSuccess = () => {
    // Here you would refetch appointments
    setIsFormOpen(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage patient appointments.</CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Schedule
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Schedule New Appointment</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to book a new appointment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <AppointmentForm onSuccess={handleFormSuccess} />
                    </div>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="flex justify-center"
            modifiers={{
              hasAppointment: appointments.map(appt => appt.appointmentDate)
            }}
            modifiersStyles={{
              hasAppointment: { 
                fontWeight: 'bold', 
                border: '2px solid hsl(var(--primary))',
                borderRadius: 'var(--radius)',
              }
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Schedule for {date ? format(date, "PPP") : "..."}
          </CardTitle>
          <CardDescription>
            {selectedDayAppointments.length} appointment(s) scheduled for this day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 rounded-lg border bg-card space-y-2">
                    <div className="font-semibold">{appt.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      with {appt.doctorName} at {appt.hospitalName}
                    </div>
                    <div className="text-sm">{appt.reason}</div>
                    <div className="flex items-center justify-between pt-2">
                        <Badge variant={appt.status === "Scheduled" ? "default" : "secondary"}>
                            {appt.status}
                        </Badge>
                        <span className="text-sm font-medium">{format(appt.appointmentDate, 'p')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <CalendarIcon className="mx-auto h-12 w-12" />
                  <p className="mt-4">No appointments scheduled for this day.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
