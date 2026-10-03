import { getServerSession } from "@/lib/session";
import { getFreelancerProposals } from "@/lib/dashboard-freelancer-proposals";
import ProposalsClientView from "./ProposalsClientView";

export default async function FreelancerMyProposalsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const proposals = freelancerEmail ? await getFreelancerProposals(freelancerEmail) : [];

  return (
    <ProposalsClientView initialProposals={proposals} />
  );
}
