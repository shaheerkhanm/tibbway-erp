import { HospitalForm } from "@/components/hospital-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditHospitalPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Hospital</CardTitle>
                    <CardDescription>
                        Update the hospital's details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HospitalForm hospitalId={params.id} />
                </CardContent>
            </Card>
        </div>
    )
}
