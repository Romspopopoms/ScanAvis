// pages/tarifs.js
import SectionOne from '../sections/Base';
import SectionTwo from '../sections/Bronze';
import SectionThree from '../sections/Silver';
import SectionFour from '../sections/Gold';

const PageTarifs = () => (
  <div className="relative z-10 min-h-screen">

    {/* Chaque section doit avoir un id correspondant à celui utilisé dans ExploreCard */}
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
  </div>
);

export default PageTarifs;
