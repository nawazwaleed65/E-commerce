import { useContext } from "react";
import Layout from "../../components/layout/layout";
import myContext from "../../Context/context";
import HeroSection from "../../components/hero/hero";
import Filter from "../../components/Filter/filter";
import ProductCard from "../../components/ProductCard/ProductCard";
import Track from "../../components/track/track";
import Testimonial from "../../components/testimonial/testimonial";


function Home() {
  const context = useContext(myContext);
  console.log('ok', context)
 
  return (
    <>
      <Layout>
        <HeroSection />
        <Filter />
        <ProductCard />
        <Track />
        <Testimonial />
      </Layout>
    </>
  );
}

export default Home;
