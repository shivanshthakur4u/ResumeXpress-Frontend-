import HeroSection from "@/components/custom/Home/HeroSection";
import Banner from "@/components/custom/Home/Banner";
import ResumeStepSection from "@/components/custom/Home/ResumeStepSection";
import FAQSection from "@/components/custom/Home/FAQSection";

export default function Home() {
  return (
    <main className="flex h-full  mx-auto w-full">
      <div className="flex flex-col gap-10 w-full">
        <HeroSection />
        {/* image */}
        <Banner />
        {/* resume step */}
        <ResumeStepSection />
        {/* faq */}
        <FAQSection />
      </div>
    </main>
  );
}
