
"use client"

import * as React from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import type { Hospital } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Mail, MapPin, Phone, User, Users } from "lucide-react"

interface HospitalDetailsProps {
    hospitalId: string
}

export function HospitalDetails({ hospitalId }: HospitalDetailsProps) {
    const { toast } = useToast()
    const [hospital, setHospital] = React.useState<Hospital | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchHospital = async () => {
            try {
                const res = await fetch(`/api/hospitals/${hospitalId}`)
                if (!res.ok) throw new Error("Failed to fetch hospital details.")
                const data = await res.json()
                setHospital(data)
            } catch (error) {
                console.error(error)
                toast({
                    title: "Error",
                    description: "Could not load hospital details.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchHospital()
    }, [hospitalId, toast])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="grid md:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full md:col-span-2" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        )
    }

    if (!hospital) {
        return <p>Hospital not found.</p>
    }

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                    <Image
                        src={hospital.imageUrl}
                        alt={hospital.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="hospital building"
                    />
                </div>
                <CardHeader>
                    <CardTitle className="text-4xl">{hospital.name}</CardTitle>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                        <MapPin className="size-5"/>
                        {hospital.location}, {hospital.country}
                    </p>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4"/>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Phone className="size-5"/>
                            <span>{hospital.phone}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Mail className="size-5"/>
                            <span>{hospital.contact}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <User className="size-5"/>
                            <span>Contact: {hospital.contactPerson}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Specialties</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hospital.specialties.map(spec => (
                            <Badge key={spec} variant="secondary" className="text-base px-4 py-2">
                                {spec}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Users className="size-5 text-primary"/>
                               <span className="font-medium">Active Patients</span>
                            </div>
                            <span className="font-bold text-lg">{hospital.activePatients || 0}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Users className="size-5 text-muted-foreground"/>
                               <span className="font-medium">Total Patients</span>
                            </div>
                            <span className="font-bold text-lg">{hospital.totalPatients || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
