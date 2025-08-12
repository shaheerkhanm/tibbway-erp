"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// This is a placeholder for actual user role from a session
const currentUserRole: UserRole = 'Super Admin';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchHospitals = async () => {
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
    };
    fetchHospitals();
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hospitals</h1>
        <Button asChild>
          <Link href="/hospitals/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Hospital
          </Link>
        </Button>
      </header>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-16 w-16 rounded-md" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell>
                            <div className="flex gap-1">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                 ))
              ) : (
                hospitals.map((hospital) => (
                  <TableRow key={hospital._id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={hospital.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={hospital.imageUrl}
                        width="64"
                        data-ai-hint="hospital building"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {hospital.name}
                    </TableCell>
                    <TableCell>{hospital.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hospital.specialties.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/hospitals/${hospital._id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          {currentUserRole === 'Super Admin' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
