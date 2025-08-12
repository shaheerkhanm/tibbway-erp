
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2, X } from "lucide-react"
import { getNames } from "country-list"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ScrollArea } from "./ui/scroll-area"

const hospitalFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location is required."),
  country: z.string().min(2, "Country is required."),
  contact: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  contactPerson: z.string().optional(),
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
  const countryNames = React.useMemo(() => getNames(), []);


  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalFormSchema),
    defaultValues: {
        name: "",
        location: "",
        country: "",
        contact: "",
        phone: "",
        contactPerson: "",
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }));
        if (response.status === 409 && errorData.code === 11000) {
            toast({
                title: "Error: Hospital Exists",
                description: "A hospital with this name already exists. Please choose a different name.",
                variant: "destructive",
            });
        } else {
             toast({
                title: `Error: ${isEditMode ? 'Update' : 'Creation'} Failed`,
                description: errorData.error || `Could not ${isEditMode ? 'update' : 'add'} the hospital. Please try again.`,
                variant: "destructive",
            });
        }
        return;
      }

      toast({
        title: `Hospital ${isEditMode ? 'Updated' : 'Added'}!`,
        description: `The hospital has been successfully ${isEditMode ? 'updated' : 'added'}.`,
      })
      router.push('/hospitals');
      router.refresh();
    } catch (error: any) {
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
                <FormLabel>Address / Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 123 Health St, Medical City" {...field} />
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1-555-123-4567" {...field} />
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
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dr. Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
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
                        <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                            {field.value.map(spec => (
                                <Badge key={spec} variant="secondary">
                                    {spec}
                                    <button type="button" className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5" onClick={() => handleSpecialtyRemove(spec)}>
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
