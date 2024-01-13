import { Footer, Navbar } from '../components';
import { About, Explore, GetStarted, Hero, WhatsNew, World } from '../sections';
import TarifsContent from '../components/page_tarifs';

const Index = () => (
  <>
    {/* Assurez-vous que la classe gradient-01 est définie dans votre fichier CSS global. */}
    <div className="gradient-01 fixed inset-0 z-0" />
    <div className="relative z-10 min-h-screen"> {/* Utilisez min-h-screen pour s'assurer que le contenu couvre au moins toute la hauteur de l'écran. */}
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
