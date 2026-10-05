import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchFreelancerById } from "@/lib/api";
import { notFound } from "next/navigation";
import FreelancerProfileClient from "./FreelancerProfileClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FreelancerDetailsPage({ params }) {
  const routeParams = await params;
  const freelancerId = routeParams?.id || routeParams?.freelancerId || routeParams?.slug;
  const freelancerResponse = await fetchFreelancerById(freelancerId);
  const freelancer = freelancerResponse?.data || null;

  if (!freelancer) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <FreelancerProfileClient freelancer={freelancer} />
      <Footer />
    </>
  );
}
