import Navbar from "@/components/Navbar";
import { getHomepageData } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import FeatureServices from "@/components/FeatureServices";
import TopFreelancers from "@/components/TopFreelancers";
import LatestTasksSection from "@/components/LatestTasksSection";
import HowItWorks from "@/components/HowItWorks";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import StatsSection from "@/components/StatsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
function HomePage({ data }) {
  const { latestTasks, topFreelancers, stats } = data;

  return (
    <main className="flex flex-col">
      <Navbar />
      <HomeHero />
      <div className="relative w-full">
        <StatsSection stats={stats} />
        <div className="w-full pt-10 pb-10">
          <FeatureServices tasks={JSON.parse(JSON.stringify(latestTasks))} />
        </div>
      </div>
      
      <div className="w-full pb-10 space-y-16">
        <TopFreelancers freelancers={JSON.parse(JSON.stringify(topFreelancers))} />
      </div>

      <div className="w-full flex flex-col gap-16 pb-16">
        <HowItWorks></HowItWorks>
        <LatestTasksSection tasks={JSON.parse(JSON.stringify(latestTasks))} />
        <div className="w-full">
          <PaymentMethodsSection />
        </div>
      </div>
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}

export default async function Home() {
  const data = await getHomepageData();
  return <HomePage data={data} />;
}
