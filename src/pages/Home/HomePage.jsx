import React, { useEffect } from "react";
import Header from '../../components/layout/Header';
import Hero from '../../components/home/Hero';
import FeaturedQuestions from '../../components/home/FeaturedQuestions';
import CategoryList from '../../components/home/CategoryList';
import TopUsers from '../../components/home/TopUsers';
import Footer from '../../components/layout/Footer';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <CategoryList />
      <FeaturedQuestions />
      <TopUsers />
      <Footer />
    </div>
  );
}
