
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Patient, Doctor, Hospital } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building2, Stethoscope, Users } from "lucide-react"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const q = searchParams.get("q") || ""

    const [results, setResults] = React.useState<{
        patients: Patient[],
        doctors: Doctor[],
        hospitals: Hospital[]
    }>({ patients: [], doctors: [], hospitals: [] });
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (!q) {
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true)
            try {
                const [patientsRes, doctorsRes, hospitalsRes] = await Promise.all([
                    fetch(`/api/patients?q=${q}`),
                    fetch(`/api/doctors?q=${q}`),
                    fetch(`/api/hospitals?q=${q}`)
                ]);

                const patients = await patientsRes.json()
                const doctors = await doctorsRes.json()
                const hospitals = await hospitalsRes.json()

                setResults({ 
                    patients: Array.isArray(patients) ? patients : [],
                    doctors: Array.isArray(doctors) ? doctors : [],
                    hospitals: Array.isArray(hospitals) ? hospitals : []
                });

            } catch (error) {
                console.error("Failed to fetch search results", error)
                setResults({ patients: [], doctors: [], hospitals: [] });
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [q])

    const { patients, doctors, hospitals } = results;
    const totalResults = patients.length + doctors.length + hospitals.length;

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold">Search Results</h1>
                <p className="text-muted-foreground">
                    {loading ? "Searching..." : `Found ${totalResults} results for "${q}"`}
                </p>
            </header>

            {loading ? (
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <div className="space-y-8">
                    {patients.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="size-6 text-primary" />
                                    Patients ({patients.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {patients.map(patient => (
                                    <Link key={patient._id} href={`/patients/${patient._id}`} className="block p-3 rounded-lg border hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{patient.email}</p>
                                            </div>
                                            <Badge variant="outline" className="ml-auto">{patient.status}</Badge>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {doctors.length > 0 && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="size-6 text-primary" />
                                    Doctors ({doctors.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {doctors.map(doctor => (
                                    <Link key={doctor._id} href={`/doctors/${doctor._id}`} className="block p-3 rounded-lg border hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{doctor.name}</p>
                                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                            </div>
                                            <p className="ml-auto text-sm">{doctor.hospital}</p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    
                    {hospitals.length > 0 && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="size-6 text-primary" />
                                    Hospitals ({hospitals.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {hospitals.map(hospital => (
                                     <Link key={hospital._id} href={`/hospitals/${hospital._id}`} className="block p-3 rounded-lg border hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={hospital.imageUrl} alt={hospital.name} />
                                                <AvatarFallback>
                                                   <Building2 className="size-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{hospital.name}</p>
                                                <p className="text-sm text-muted-foreground">{hospital.location}</p>
                                            </div>
                                            <p className="ml-auto text-sm">{hospital.country}</p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {totalResults === 0 && !loading && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <p>No results found for your search.</p>
                                <p className="text-muted-foreground text-sm">Try searching for something else.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
