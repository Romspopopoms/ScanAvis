// pages/tarifs.js
import { Navbar, Footer } from '../components';
import SectionOne from '../sections/Base';
import SectionTwo from '../sections/Bronze';
import SectionThree from '../sections/Silver';
import SectionFour from '../sections/Gold';

const PageTarifs = () => (
  <div className="bg-primary-black overflow-hidden">
    {/* Appliquer le gradient personnalisé comme fond */}
    <div className="gradient-01 absolute inset-0 z-0" />
    <Navbar />

    {/* Chaque section doit avoir un id correspondant à celui utilisé dans ExploreCard */}
    <div className="gradient-03 z-0" />
    <div id="world-1">
      <SectionOne />
    </div>
    <div id="world-2">
      <SectionTwo />
    </div>
    <div id="world-3">
      <SectionThree />
    </div>
    <div id="world-4">
      <SectionFour />
    </div>
    <Footer />
  </div>
);

export default PageTarifs;
