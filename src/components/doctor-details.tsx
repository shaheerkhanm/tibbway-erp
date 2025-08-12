
"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import type { Doctor } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Star, Phone, Mail, Building, Briefcase } from "lucide-react"

interface DoctorDetailsProps {
    doctorId: string
}

export function DoctorDetails({ doctorId }: DoctorDetailsProps) {
    const { toast } = useToast()
    const [doctor, setDoctor] = React.useState<Doctor | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`/api/doctors/${doctorId}`)
                if (!res.ok) throw new Error("Failed to fetch doctor details.")
                const data = await res.json()
                setDoctor(data)
            } catch (error) {
                console.error(error)
                toast({
                    title: "Error",
                    description: "Could not load doctor details.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchDoctor()
    }, [doctorId, toast])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!doctor) {
        return <p>Doctor not found.</p>
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                    <Avatar className="size-24">
                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint="doctor person" />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl">{doctor.name}</CardTitle>
                        <p className="text-xl text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-2 text-yellow-500">
                            {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                                <Star key={i} className="size-5 fill-current" />
                            ))}
                            <span className="text-muted-foreground ml-2">({doctor.rating})</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>
                        <div className="text-muted-foreground space-y-2">
                             <div className="flex items-center gap-3">
                                <Mail className="size-5" />
                                <span>{doctor.email}</span>
                             </div>
                              <div className="flex items-center gap-3">
                                <Phone className="size-5" />
                                <span>{doctor.phone}</span>
                             </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Professional Details</h3>
                         <div className="text-muted-foreground space-y-2">
                             <div className="flex items-center gap-3">
                                <Building className="size-5" />
                                <span>{doctor.hospital}</span>
                             </div>
                              <div className="flex items-center gap-3">
                                <Briefcase className="size-5" />
                                <span>{doctor.experience} years of experience</span>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                     {doctor.availableSlots && doctor.availableSlots.map(slot => (
                        <Badge key={slot} variant="secondary" className="text-base px-4 py-2">
                            {slot}
                        </Badge>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
