
"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2, X, Star, Upload } from "lucide-react"

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
import { Badge } from "./ui/badge"

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required."),
  specialty: z.string().min(2, "Specialty is required."),
  hospital: z.string().min(1, "Hospital is required."),
  experience: z.coerce.number().min(0, "Experience must be a positive number."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  availableSlots: z.array(z.string()).min(1, "At least one available slot is required."),
  imageUrl: z.string().optional(),
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
  const [slotInput, setSlotInput] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      hospital: "",
      experience: 0,
      rating: 4.5,
      availableSlots: [],
      imageUrl: "",
    }
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
          if (doctorData.imageUrl) {
            setImagePreview(doctorData.imageUrl);
          }
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

  const handleSlotAdd = () => {
    if (slotInput.trim().match(/^\d{2}:\d{2}-\d{2}:\d{2}$/)) {
        const currentSlots = form.getValues("availableSlots");
        if (!currentSlots.includes(slotInput.trim())) {
            form.setValue("availableSlots", [...currentSlots, slotInput.trim()]);
            setSlotInput("");
        }
    } else {
        toast({
            title: "Invalid Slot Format",
            description: "Please use HH:mm-HH:mm format (e.g., 09:00-12:00).",
            variant: "destructive"
        })
    }
  };

  const handleSlotRemove = (slotToRemove: string) => {
    const currentSlots = form.getValues("availableSlots");
    form.setValue("availableSlots", currentSlots.filter(slot => slot !== slotToRemove));
  }
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: DoctorFormValues) {
    let imageUrl = data.imageUrl || `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`;

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "doctors");

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      } catch (error) {
        console.error(error);
        toast({
          title: "Image Upload Error",
          description: "Could not upload the image. Please try again.",
          variant: "destructive"
        });
        return; // Stop form submission if image upload fails
      }
    }


    const apiEndpoint = isEditMode ? `/api/doctors/${doctorId}` : '/api/doctors';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          imageUrl,
          activePatients: isEditMode ? form.getValues('activePatients') : Math.floor(Math.random() * 20),
          totalPatients: isEditMode ? form.getValues('totalPatients') : Math.floor(Math.random() * 200) + 50,
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
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                name="email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91-98765-43210" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="4.8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="space-y-2">
                <FormLabel>Profile Picture</FormLabel>
                 <div 
                    className="relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                   {imagePreview ? (
                      <Image src={imagePreview} alt="Doctor preview" layout="fill" objectFit="cover" className="rounded-lg" />
                   ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-8 w-8" />
                        <p>Click to upload</p>
                      </div>
                   )}
                   <Input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                 </div>
            </div>
        </div>

          <div className="md:col-span-2">
            <FormField
                control={form.control}
                name="availableSlots"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Available Slots</FormLabel>
                        <div className="flex gap-2">
                            <Input 
                                value={slotInput}
                                onChange={(e) => setSlotInput(e.target.value)}
                                placeholder="e.g. 09:00-12:00"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSlotAdd();
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={handleSlotAdd}>Add Slot</Button>
                        </div>
                        <FormDescription>
                            Type a time slot in HH:mm-HH:mm format and press Enter or click Add.
                        </FormDescription>
                        <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                            {field.value.map(slot => (
                                <Badge key={slot} variant="secondary">
                                    {slot}
                                    <button type="button" className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5" onClick={() => handleSlotRemove(slot)}>
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
