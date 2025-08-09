import { DoctorForm } from "@/components/doctor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditDoctorPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Doctor</CardTitle>
                    <CardDescription>
                        Update the doctor's details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DoctorForm doctorId={params.id} />
                </CardContent>
            </Card>
        </div>
    )
}
