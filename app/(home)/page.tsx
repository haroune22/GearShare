import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import Why from "@/components/Why";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Categories />
      <Why />
    </div>
  );
}
