"use client"

import * as React from "react"
import { isSameDay, format, parseISO } from "date-fns"
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react"

import type { Appointment } from "@/lib/types"
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
import { Skeleton } from "./ui/skeleton"

export function AppointmentsCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const fetchAppointments = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      
      const formattedData = data.map((appt: any) => ({
        ...appt,
        appointmentDate: parseISO(appt.appointmentDate)
      }));
      setAppointments(formattedData);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  const selectedDayAppointments = React.useMemo(() => {
    return date
      ? appointments.filter((appt) => isSameDay(appt.appointmentDate, date))
      : []
  }, [date, appointments])
  
  const appointmentDates = React.useMemo(() => {
    return appointments.map(appt => appt.appointmentDate);
  }, [appointments]);

  const handleFormSuccess = () => {
    fetchAppointments();
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
        <CardContent className="p-0 flex justify-center">
            {loading ? <Skeleton className="w-[80%] h-[350px]" /> :
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="flex justify-center"
                    modifiers={{
                    hasAppointment: appointmentDates
                    }}
                    modifiersStyles={{
                    hasAppointment: { 
                        fontWeight: 'bold', 
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: 'var(--radius)',
                    }
                    }}
                />
            }
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
              {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-28 w-full rounded-lg" />
                    <Skeleton className="h-28 w-full rounded-lg" />
                </div>
              ) : selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((appt) => (
                  <div key={appt._id} className="p-4 rounded-lg border bg-card space-y-2">
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
