
"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PatientDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isEditPage = pathname.includes("/edit")

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
         <Button variant="outline" asChild>
            <Link href="/patients">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Patients
            </Link>
         </Button>
         <h1 className="text-2xl font-bold">
            {isEditPage ? "Edit Patient Details" : "Patient Details"}
         </h1>
      </div>
      {children}
    </div>
  )
}
