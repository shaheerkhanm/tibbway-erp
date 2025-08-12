
"use client"

import * as React from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Upload,
  Filter,
  Eye,
  Edit,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Patient, UserRole } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// This is a placeholder for actual user role from a session
const currentUserRole: UserRole = 'Super Admin';

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" } = {
    "Confirmed": "success",
    "In Treatment": "default",
    "Pending": "secondary",
    "Discharged": "outline",
    "Cancelled": "destructive",
    "Lead": "warning",
}

export default function PatientsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [loading, setLoading] = React.useState(true)
  const [patientToDelete, setPatientToDelete] = React.useState<Patient | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const fetchPatients = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setPatients([]);
      }
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients])

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
        const response = await fetch(`/api/patients/${patientToDelete._id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error("Failed to delete patient.");

        toast({
            title: "Patient Deleted",
            description: `${patientToDelete.name} has been successfully removed.`,
        });
        fetchPatients(); // Refresh the list
    } catch (error) {
        console.error("Delete error:", error);
        toast({
            title: "Error",
            description: "Could not delete the patient. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsAlertOpen(false);
        setPatientToDelete(null);
    }
  };

  const openConfirmationDialog = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsAlertOpen(true);
  };


  return (
    <>
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage and track patient information</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
             <Upload className="mr-2 h-4 w-4"/>
             Export
           </Button>
           <Button asChild>
            <Link href="/patients/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
            </Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardContent>
          <div className="py-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-10 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  All Statuses
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem checked>All Statuses</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Confirmed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>In Treatment</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Lead</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Arrival Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <Skeleton className="h-4 w-[120px]" />
                                    <Skeleton className="h-3 w-[80px] mt-1" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-3 w-[150px] mt-1" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                             <TableCell>
                                <div className="flex flex-col">
                                    <Skeleton className="h-4 w-[130px]" />
                                    <Skeleton className="h-3 w-[100px] mt-1" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    patients.map((patient) => (
                    <TableRow key={patient._id}>
                        <TableCell>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">{patient.patientId || `US${patient._id.slice(-7)}`}</div>
                        </TableCell>
                        <TableCell>{patient.country}</TableCell>
                        <TableCell>
                            <div className="font-medium">{patient.phone || "+1-555-0123"}</div>
                            <div className="text-sm text-muted-foreground">{patient.email}</div>
                        </TableCell>
                        <TableCell>
                        <Badge variant={statusVariant[patient.status] || 'default'}>{patient.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{patient.assignedHospital}</div>
                            <div className="text-sm text-muted-foreground">{patient.assignedDoctor}</div>
                        </TableCell>
                        <TableCell>{new Date(patient.treatmentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/patients/${patient._id}/edit`}><Edit className="h-4 w-4"/></Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {currentUserRole === 'Super Admin' && (
                                    <>
                                        <DropdownMenuItem className="text-destructive" onClick={() => openConfirmationDialog(patient)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the patient
                and remove their data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient}>
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
