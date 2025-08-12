
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, parseISO } from "date-fns"
import { CalendarIcon, PlusCircle, Loader2 } from "lucide-react"
import { getNames } from "country-list"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Doctor, Hospital, Patient } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea } from "./ui/scroll-area"

const patientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  country: z.string().min(2, "Country is required."),
  status: z.enum(['Pending', 'In Treatment', 'Discharged', 'Cancelled']),
  assignedDoctor: z.string().min(1, "Doctor is required."),
  assignedHospital: z.string().min(1, "Hospital is required."),
  treatmentDate: z.date({
    required_error: "A treatment date is required.",
  }),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormProps {
    patientId?: string;
}

export function PatientForm({ patientId }: PatientFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(true);
  const isEditMode = !!patientId;
  const countryNames = React.useMemo(() => getNames(), []);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      status: "Pending",
    },
  })

  React.useEffect(() => {
    const fetchData = async () => {
        try {
            const [doctorsRes, hospitalsRes] = await Promise.all([
                fetch('/api/doctors'),
                fetch('/api/hospitals'),
            ]);

            const doctorsData = await doctorsRes.json();
            const hospitalsData = await hospitalsRes.json();

            if (Array.isArray(doctorsData)) {
              setDoctors(doctorsData);
            } else {
              setDoctors([]);
              console.error("Fetched doctors data is not an array:", doctorsData);
            }
            
            if (Array.isArray(hospitalsData)) {
              setHospitals(hospitalsData);
            } else {
              setHospitals([]);
              console.error("Fetched hospitals data is not an array:", hospitalsData);
            }


            if (isEditMode) {
                const patientRes = await fetch(`/api/patients/${patientId}`);
                const patientData: Patient = await patientRes.json();
                form.reset({
                    ...patientData,
                    treatmentDate: parseISO(patientData.treatmentDate),
                });
            }
        } catch (error) {
            console.error("Failed to fetch data for form", error);
            toast({
                title: "Error",
                description: "Failed to load data for the form. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [patientId, isEditMode, form, toast])


  async function onSubmit(data: PatientFormValues) {
    const apiEndpoint = isEditMode ? `/api/patients/${patientId}` : '/api/patients';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(apiEndpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                treatmentDate: format(data.treatmentDate, "yyyy-MM-dd"),
                avatar: `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`
            }),
        });
        if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} patient`);
        
        toast({
            title: `Patient ${isEditMode ? 'Updated' : 'Added'}!`,
            description: `The patient has been successfully ${isEditMode ? 'updated' : 'added'}.`,
        })
        router.push('/patients');
        router.refresh();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: `Could not ${isEditMode ? 'update' : 'add'} the patient. Please try again.`,
            variant: "destructive"
        })
    }
  }

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="patient@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            {countryNames.map(country => (
                                <SelectItem key={country} value={country}>
                                {country}
                                </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select patient status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Treatment">In Treatment</SelectItem>
                        <SelectItem value="Discharged">Discharged</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="assignedHospital"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Assign Hospital</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hospital" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {hospitals.map(hospital => (
                        <SelectItem key={hospital._id} value={hospital.name}>
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
            name="assignedDoctor"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Assign Doctor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {doctors.map(doctor => (
                        <SelectItem key={doctor._id} value={doctor.name}>
                        {doctor.name} ({doctor.specialty})
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
            name="treatmentDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Treatment Start Date</FormLabel>
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
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
                <Loader2 className="mr-2 animate-spin" />
                {isEditMode ? "Updating Patient..." : "Adding Patient..."}
            </>
          ) : (
            <>
                <PlusCircle className="mr-2" />
                {isEditMode ? "Update Patient" : "Add Patient"}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
