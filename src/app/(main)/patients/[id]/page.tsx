
import { PatientDetails } from "@/components/patient-details"

export default function ViewPatientPage({ params }: { params: { id: string } }) {
    return (
       <PatientDetails patientId={params.id} />
    )
}
