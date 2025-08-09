import { PatientForm } from "@/components/patient-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPatientPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Patient</CardTitle>
                    <CardDescription>
                        Update the patient's details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PatientForm patientId={params.id} />
                </CardContent>
            </Card>
        </div>
    )
}
