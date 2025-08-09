"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2 } from "lucide-react"

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
import { useToast } from "@/hooks/use-toast"
import type { Doctor, Hospital } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  specialty: z.string().min(2, "Specialty is required."),
  hospital: z.string().min(1, "Hospital is required."),
  contact: z.string().email("Please enter a valid email address."),
})

type DoctorFormValues = z.infer<typeof doctorFormSchema>

interface DoctorFormProps {
  doctorId?: string;
}

export function DoctorForm({ doctorId }: DoctorFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(true);
  const isEditMode = !!doctorId;

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalsRes = await fetch('/api/hospitals');
        setHospitals(await hospitalsRes.json());

        if (isEditMode) {
          const doctorRes = await fetch(`/api/doctors/${doctorId}`);
          const doctorData: Doctor = await doctorRes.json();
          form.reset(doctorData);
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
  }, [doctorId, isEditMode, form, toast])

  async function onSubmit(data: DoctorFormValues) {
    const apiEndpoint = isEditMode ? `/api/doctors/${doctorId}` : '/api/doctors';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          imageUrl: `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`
        }),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} doctor`);

      toast({
        title: `Doctor ${isEditMode ? 'Updated' : 'Added'}!`,
        description: `The doctor has been successfully ${isEditMode ? 'updated' : 'added'}.`,
      })
      router.push('/doctors');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Could not ${isEditMode ? 'update' : 'add'} the doctor. Please try again.`,
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
            </div>
            <Skeleton className="h-10 w-32" />
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
                  <Input placeholder="Dr. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="doctor@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialty</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Cardiology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hospital"
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
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
                <Loader2 className="mr-2 animate-spin" />
                {isEditMode ? "Updating Doctor..." : "Adding Doctor..."}
            </>
          ) : (
            <>
              <PlusCircle className="mr-2" />
              {isEditMode ? "Update Doctor" : "Add Doctor"}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
