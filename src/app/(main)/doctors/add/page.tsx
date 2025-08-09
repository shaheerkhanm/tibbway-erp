import { DoctorForm } from "@/components/doctor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddDoctorPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Doctor</CardTitle>
                    <CardDescription>
                        Fill out the form below to add a new doctor to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DoctorForm />
                </CardContent>
            </Card>
        </div>
    )
}
