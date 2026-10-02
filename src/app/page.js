import Navbar from "@/components/Navbar";
import { getHomepageData } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import FeatureServices from "@/components/FeatureServices";
import TopFreelancers from "@/components/TopFreelancers";
import HowItWorks from "@/components/HowItWorks";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

function HomePage({ data }) {
  const { latestTasks, topFreelancers, stats } = data;

  return (
    <main className="flex flex-col">
      <Navbar />
      <HomeHero />
      <div className="container mx-auto py-10 space-y-16">
        <FeatureServices tasks={JSON.parse(JSON.stringify(latestTasks))} />
        <TopFreelancers freelancers={topFreelancers} />
        <HowItWorks></HowItWorks>
        <PaymentMethodsSection />
        <StatsSection stats={stats} />
      </div>
      <Footer></Footer>
    </main>
  );
}

export default async function Home() {
  const data = await getHomepageData();
  return <HomePage data={data} />;
}
