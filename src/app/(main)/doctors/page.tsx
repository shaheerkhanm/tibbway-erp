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
import type { Doctor } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors")
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Failed to fetch doctors:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button asChild>
          <Link href="/doctors/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Doctor
          </Link>
        </Button>
      </header>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint="doctor person" />
                          <AvatarFallback>
                            {doctor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{doctor.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{doctor.hospital}</TableCell>
                    <TableCell>{doctor.contact}</TableCell>
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
                            <Link href={`/doctors/${doctor._id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
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
