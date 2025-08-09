import { PatientForm } from "@/components/patient-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddPatientPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Patient</CardTitle>
                    <CardDescription>
                        Fill out the form below to add a new patient to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PatientForm />
                </CardContent>
            </Card>
        </div>
    )
}