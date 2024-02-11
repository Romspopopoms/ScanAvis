import { About, Explore, GetStarted, Hero, WhatsNew, World } from '../sections';
import TarifsContent from '../components/page_tarifs';

const Index = () => (
  <div className="relative z-10 min-h-screen">
    <Hero />
    <div className="px-4 sm:px-6 lg:px-8">
      <About />
      <TarifsContent />
      <GetStarted />
      <WhatsNew />
      <Explore />
      <World />
    </div>
  </div>
);

export default Index;
