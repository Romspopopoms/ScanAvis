import { Footer, Navbar } from '../components';
import { About, Explore, GetStarted, Hero, WhatsNew, World } from '../sections';
import TarifsContent from '../components/page_tarifs';

const Index = () => (
  <>
    <div className="gradient-01 fixed inset-0 z-0" />
    <div className="relative z-10 min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <TarifsContent />
      <GetStarted />
      <WhatsNew />
      <Explore />
      <World />
      <Footer />
    </div>
  </>
);

export default Index;
