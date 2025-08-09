"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Hospital } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { Badge } from "./ui/badge"

const hospitalFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location is required."),
  contact: z.string().email("Please enter a valid email address."),
  specialties: z.array(z.string()).min(1, "At least one specialty is required."),
})

type HospitalFormValues = z.infer<typeof hospitalFormSchema>

interface HospitalFormProps {
  hospitalId?: string;
}

export function HospitalForm({ hospitalId }: HospitalFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(true);
  const isEditMode = !!hospitalId;
  const [specialtyInput, setSpecialtyInput] = React.useState("");

  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalFormSchema),
    defaultValues: {
        specialties: []
    }
  })

  React.useEffect(() => {
    const fetchHospital = async () => {
      if (isEditMode) {
        try {
          const res = await fetch(`/api/hospitals/${hospitalId}`);
          const hospitalData: Hospital = await res.json();
          form.reset(hospitalData);
        } catch (error) {
          console.error("Failed to fetch hospital data", error);
          toast({
            title: "Error",
            description: "Failed to load hospital data. Please try again.",
            variant: "destructive"
          });
        }
      }
      setLoading(false);
    }
    fetchHospital();
  }, [hospitalId, isEditMode, form, toast])

  const handleSpecialtyAdd = () => {
    if (specialtyInput.trim() !== "") {
        const currentSpecialties = form.getValues("specialties");
        if (!currentSpecialties.includes(specialtyInput.trim())) {
            form.setValue("specialties", [...currentSpecialties, specialtyInput.trim()]);
            setSpecialtyInput("");
        }
    }
  };

  const handleSpecialtyRemove = (specToRemove: string) => {
    const currentSpecialties = form.getValues("specialties");
    form.setValue("specialties", currentSpecialties.filter(spec => spec !== specToRemove));
  }


  async function onSubmit(data: HospitalFormValues) {
    const apiEndpoint = isEditMode ? `/api/hospitals/${hospitalId}` : '/api/hospitals';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          imageUrl: `https://placehold.co/600x400.png`
        }),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} hospital`);

      toast({
        title: `Hospital ${isEditMode ? 'Updated' : 'Added'}!`,
        description: `The hospital has been successfully ${isEditMode ? 'updated' : 'added'}.`,
      })
      router.push('/hospitals');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Could not ${isEditMode ? 'update' : 'add'} the hospital. Please try again.`,
        variant: "destructive"
      })
    }
  }

  if (loading && isEditMode) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
    );
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
                <FormLabel>Hospital Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Global Health Center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New York, USA" {...field} />
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
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@hospital.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <div className="flex gap-2">
                        <Input 
                            value={specialtyInput}
                            onChange={(e) => setSpecialtyInput(e.target.value)}
                            placeholder="e.g. Cardiology"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSpecialtyAdd();
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={handleSpecialtyAdd}>Add</Button>
                    </div>
                    <FormDescription>
                        Type a specialty and press Enter or click Add.
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {field.value.map(spec => (
                            <Badge key={spec} variant="secondary">
                                {spec}
                                <button type="button" className="ml-2" onClick={() => handleSpecialtyRemove(spec)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
                <Loader2 className="mr-2 animate-spin" />
                {isEditMode ? "Updating Hospital..." : "Adding Hospital..."}
            </>
          ) : (
            <>
              <PlusCircle className="mr-2" />
              {isEditMode ? "Update Hospital" : "Add Hospital"}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
