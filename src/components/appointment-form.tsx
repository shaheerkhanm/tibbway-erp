"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Doctor, Hospital, Patient } from "@/lib/types"

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  doctorId: z.string().min(1, "Doctor is required."),
  hospitalId: z.string().min(1, "Hospital is required."),
  appointmentDate: z.date({
    required_error: "An appointment date is required.",
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters."),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export function AppointmentForm({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const { toast } = useToast()
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
        try {
            const [patientsRes, doctorsRes, hospitalsRes] = await Promise.all([
                fetch('/api/patients'),
                fetch('/api/doctors'),
                fetch('/api/hospitals'),
            ]);
            setPatients(await patientsRes.json());
            setDoctors(await doctorsRes.json());
            setHospitals(await hospitalsRes.json());
        } catch (error) {
            console.error("Failed to fetch data for form", error);
            toast({
                title: "Error",
                description: "Failed to load data for the form. Please try again.",
                variant: "destructive"
            })
        }
    }
    fetchData();
  }, [toast])


  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      reason: "",
    },
  })

  async function onSubmit(data: AppointmentFormValues) {
    const patient = patients.find(p => p._id === data.patientId);
    const doctor = doctors.find(d => d._id === data.doctorId);
    const hospital = hospitals.find(h => h._id === data.hospitalId);

    if (!patient || !doctor || !hospital) {
        toast({ title: "Error", description: "Invalid selection.", variant: "destructive" });
        return;
    }

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                patientName: patient.name,
                doctorName: doctor.name,
                hospitalName: hospital.name,
                status: 'Scheduled',
            }),
        });
        if (!response.ok) throw new Error("Failed to create appointment");
        
        toast({
            title: "Appointment Scheduled!",
            description: "The new appointment has been successfully added to the calendar.",
        })
        onSuccess()
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Could not schedule the appointment. Please try again.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {patients.map(patient => (
                        <SelectItem key={patient._id} value={patient._id}>
                        {patient.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {doctors.map(doctor => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="hospitalId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hospital</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hospital" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {hospitals.map(hospital => (
                        <SelectItem key={hospital._id} value={hospital._id}>
                        {hospital.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Appointment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Annual check-up, follow-up, new symptoms..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Scheduling..." : (
            <>
                <PlusCircle className="mr-2" />
                Schedule Appointment
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
