import { HospitalForm } from "@/components/hospital-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddHospitalPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Hospital</CardTitle>
                    <CardDescription>
                        Fill out the form below to add a new hospital to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HospitalForm />
                </CardContent>
            </Card>
        </div>
    )
}
