
"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, PlusCircle, User, Mail, Phone, Clock, Star, Search, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Doctor, UserRole, Hospital } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// This is a placeholder for actual user role from a session
const currentUserRole: UserRole = 'Super Admin';

export default function DoctorsPage() {
  const { toast } = useToast();
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(true)
  const [doctorToDelete, setDoctorToDelete] = React.useState<Doctor | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const fetchDoctorsAndHospitals = React.useCallback(async () => {
      setLoading(true);
      try {
        const [doctorsResponse, hospitalsResponse] = await Promise.all([
            fetch("/api/doctors"),
            fetch("/api/hospitals")
        ]);
        const doctorsData = await doctorsResponse.json()
        const hospitalsData = await hospitalsResponse.json()
        
        if (Array.isArray(doctorsData)) setDoctors(doctorsData);
        if (Array.isArray(hospitalsData)) setHospitals(hospitalsData);

      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
  }, []);


  React.useEffect(() => {
    fetchDoctorsAndHospitals()
  }, [fetchDoctorsAndHospitals])

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
        const response = await fetch(`/api/doctors/${doctorToDelete._id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error("Failed to delete doctor.");

        toast({
            title: "Doctor Deleted",
            description: `Dr. ${doctorToDelete.name} has been successfully removed.`,
        });
        fetchDoctorsAndHospitals(); // Refresh the list
    } catch (error) {
        console.error("Delete error:", error);
        toast({
            title: "Error",
            description: "Could not delete the doctor. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsAlertOpen(false);
        setDoctorToDelete(null);
    }
  };

  const openConfirmationDialog = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsAlertOpen(true);
  };

  return (
    <>
    <div className="flex flex-col gap-6">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">Manage medical professionals and specialists</p>
        </div>
        <Button asChild>
          <Link href="/doctors/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Doctor
          </Link>
        </Button>
      </header>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." className="pl-10 w-full max-w-lg bg-background" />
        </div>
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Hospitals" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {hospitals.map(h => <SelectItem key={h._id} value={h.name}>{h.name}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <Avatar className="size-12">
                                <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint="doctor person" />
                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-bold">{doctor.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/doctors/${doctor._id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/doctors/${doctor._id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            {currentUserRole === 'Super Admin' && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => openConfirmationDialog(doctor)}>
                                    Delete
                                </DropdownMenuItem>
                                </>
                            )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className="text-sm space-y-2">
                        <p className="font-semibold">Hospital</p>
                        <p className="text-muted-foreground">{doctor.hospital}</p>
                    </div>
                     <div className="text-sm space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Phone className="size-4" /> <span>{doctor.phone}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Mail className="size-4" /> <span>{doctor.email}</span>
                        </div>
                    </div>
                     <div className="text-sm space-y-2">
                        <p className="font-semibold">Experience</p>
                        <p className="text-muted-foreground">{doctor.experience} years</p>
                    </div>
                    <div className="text-sm space-y-2">
                        <p className="font-semibold">Available Slots</p>
                        <div className="flex flex-wrap gap-2">
                            {doctor.availableSlots && doctor.availableSlots.map(slot => (
                                <Badge key={slot} variant="outline">{slot}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-center pt-2">
                        <div>
                            <p className="text-xl font-bold">{doctor.activePatients}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold">{doctor.totalPatients}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold flex items-center justify-center gap-1">
                                <Star className="size-4 text-yellow-400 fill-yellow-400" />
                                {doctor.rating}
                            </p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/40 p-4 border-t gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/doctors/${doctor._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href={`/doctors/${doctor._id}`}>View Profile</Link>
                    </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the doctor
                and remove their data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDoctorToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoctor}>
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
