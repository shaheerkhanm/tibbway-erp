
"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, PlusCircle, Building2, MapPin, Phone, Mail, Edit, Search } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Hospital, UserRole } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

const currentUserRole: UserRole = 'Super Admin';

const MAX_SPECIALTIES_VISIBLE = 3;

export default function HospitalsPage() {
  const { toast } = useToast();
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(true)
  const [hospitalToDelete, setHospitalToDelete] = React.useState<Hospital | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);


  const fetchHospitals = React.useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetch('/api/hospitals');
        const data = await response.json();
        if (Array.isArray(data)) {
            setHospitals(data);
        } else {
            console.error("Fetched data is not an array:", data);
            setHospitals([]);
        }
    } catch (error) {
        console.error("Failed to fetch hospitals", error);
    } finally {
        setLoading(false);
    }
  }, []);


  React.useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals])


  const handleDeleteHospital = async () => {
    if (!hospitalToDelete) return;
    try {
        const response = await fetch(`/api/hospitals/${hospitalToDelete._id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error("Failed to delete hospital.");

        toast({
            title: "Hospital Deleted",
            description: `${hospitalToDelete.name} has been successfully removed.`,
        });
        fetchHospitals(); // Refresh the list
    } catch (error) {
        console.error("Delete error:", error);
        toast({
            title: "Error",
            description: "Could not delete the hospital. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsAlertOpen(false);
        setHospitalToDelete(null);
    }
  };

  const openConfirmationDialog = (hospital: Hospital) => {
    setHospitalToDelete(hospital);
    setIsAlertOpen(true);
  };

  return (
    <>
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hospitals</h1>
          <p className="text-muted-foreground">Manage partner hospitals and medical facilities</p>
        </div>
        <Button asChild>
          <Link href="/hospitals/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Hospital
          </Link>
        </Button>
      </header>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search hospitals..." className="pl-10 w-full max-w-lg bg-background" />
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
                         <Separator />
                         <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <div className="flex gap-2">
                             <Skeleton className="h-6 w-16" />
                             <Skeleton className="h-6 w-20" />
                           </div>
                         </div>
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
          {hospitals.map((hospital) => {
            const visibleSpecialties = hospital.specialties.slice(0, MAX_SPECIALTIES_VISIBLE);
            const hiddenSpecialtiesCount = hospital.specialties.length - MAX_SPECIALTIES_VISIBLE;

            return (
              <Card key={hospital._id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
                                <Building2 className="size-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{hospital.name}</h3>
                                <p className="text-sm text-muted-foreground">{hospital.country || "India"}</p>
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
                                <Link href={`/hospitals/${hospital._id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/hospitals/${hospital._id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            {currentUserRole === 'Super Admin' && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => openConfirmationDialog(hospital)}>
                                    Delete
                                </DropdownMenuItem>
                                </>
                            )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-4 mt-0.5 shrink-0" />
                      <span>{hospital.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 shrink-0" />
                      <span>{hospital.phone || "+91-11-2651-5050"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 shrink-0" />
                      <span>{hospital.contact}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Contact Person</h4>
                    <p className="text-sm text-muted-foreground">{hospital.contactPerson || "Dr. Sandeep Budhiraja"}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                     <h4 className="font-semibold text-sm">Specialties</h4>
                     <div className="flex flex-wrap gap-2">
                        {visibleSpecialties.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                        {hiddenSpecialtiesCount > 0 && (
                            <Badge variant="outline">+{hiddenSpecialtiesCount} more</Badge>
                        )}
                      </div>
                  </div>
                   <Separator />
                   <div className="flex justify-between text-center">
                        <div>
                            <p className="text-2xl font-bold">{hospital.activePatients || 0}</p>
                            <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{hospital.totalPatients || 0}</p>
                            <p className="text-sm text-muted-foreground">Total</p>
                        </div>
                   </div>
                </CardContent>
                <CardFooter className="bg-muted/40 p-4 border-t gap-2">
                   <Button variant="outline" className="w-full" asChild>
                      <Link href={`/hospitals/${hospital._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href={`/hospitals/${hospital._id}`}>View Details</Link>
                    </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
     <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the hospital
                and remove its data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHospitalToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHospital}>
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
