import Navbar from "@/components/Navbar";
import { getHomepageData } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import LatestTasks from "@/components/LatestTasks";
import TopFreelancers from "@/components/TopFreelancers";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

function HomePage({ data }) {
  const { latestTasks, topFreelancers, stats } = data;

  return (
    <main className="flex flex-col">
      <Navbar />
      <HomeHero />
      <div className="container mx-auto py-10 space-y-16">
        <LatestTasks tasks={latestTasks} />
        <TopFreelancers freelancers={topFreelancers} />
        <HowItWorks></HowItWorks>
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
