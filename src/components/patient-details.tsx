
"use client"

import * as React from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Patient } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Edit, Calendar, MapPin, Stethoscope, Building, Phone, Mail } from "lucide-react"

interface PatientDetailsProps {
    patientId: string
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" } = {
    "Confirmed": "success",
    "In Treatment": "default",
    "Pending": "secondary",
    "Discharged": "outline",
    "Cancelled": "destructive",
    "Lead": "warning",
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
    const { toast } = useToast()
    const [patient, setPatient] = React.useState<Patient | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}`)
                if (!res.ok) throw new Error("Failed to fetch patient details.")
                const data = await res.json()
                setPatient(data)
            } catch (error) {
                console.error(error)
                toast({
                    title: "Error",
                    description: "Could not load patient details.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchPatient()
    }, [patientId, toast])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!patient) {
        return <p>Patient not found.</p>
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <Avatar className="size-20">
                                <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-3xl">{patient.name}</CardTitle>
                                <CardDescription>
                                    Patient ID: {patient.patientId || `US${patient._id.slice(-7)}`}
                                </CardDescription>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/patients/${patient._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-muted-foreground">Status</h3>
                            <Badge variant={statusVariant[patient.status] || 'default'} className="text-sm">
                                {patient.status}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold text-muted-foreground">Treatment Date</h3>
                             <p className="flex items-center gap-2">
                                <Calendar className="size-4" /> {new Date(patient.treatmentDate).toLocaleDateString()}
                             </p>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold text-muted-foreground">Country</h3>
                             <p className="flex items-center gap-2">
                                <MapPin className="size-4" /> {patient.country}
                             </p>
                        </div>
                         <div className="space-y-2">
                             <h3 className="font-semibold text-muted-foreground">Assigned Doctor</h3>
                             <p className="flex items-center gap-2">
                                <Stethoscope className="size-4" /> {patient.assignedDoctor}
                             </p>
                        </div>
                         <div className="space-y-2">
                             <h3 className="font-semibold text-muted-foreground">Assigned Hospital</h3>
                             <p className="flex items-center gap-2">
                                <Building className="size-4" /> {patient.assignedHospital}
                             </p>
                        </div>
                    </div>
                     <Separator className="my-6" />
                     <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                     <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                           <div className="bg-primary/10 p-2 rounded-md">
                                <Phone className="size-5 text-primary"/>
                           </div>
                           <div>
                                <p className="text-xs">Phone</p>
                                <p className="font-medium text-foreground">{patient.phone || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                           <div className="bg-primary/10 p-2 rounded-md">
                                <Mail className="size-5 text-primary"/>
                           </div>
                           <div>
                                <p className="text-xs">Email</p>
                                <p className="font-medium text-foreground">{patient.email}</p>
                           </div>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </div>
    )
}
