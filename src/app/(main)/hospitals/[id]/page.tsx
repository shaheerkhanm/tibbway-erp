
import { HospitalDetails } from "@/components/hospital-details";

export default function ViewHospitalPage({ params }: { params: { id: string } }) {
    return (
        <HospitalDetails hospitalId={params.id} />
    )
}
