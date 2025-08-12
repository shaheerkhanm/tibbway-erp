
import { DoctorDetails } from "@/components/doctor-details";

export default function ViewDoctorPage({ params }: { params: { id: string } }) {
    return (
        <DoctorDetails doctorId={params.id} />
    )
}
