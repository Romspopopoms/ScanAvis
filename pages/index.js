import { About, Explore, GetStarted, Hero, WhatsNew, World } from '../sections';
import TarifsContent from '../components/page_tarifs';

const Index = () => (
  <div className="relative z-10 min-h-screen">
    <Hero />
    <About />
    <TarifsContent />
    <GetStarted />
    <WhatsNew />
    <Explore />
    <World />
  </div>
);

export default Index;
