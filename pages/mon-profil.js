import { Footer, Navbar } from '../components';
import MonProfil from '../components/mon-profil';

const MonProfilPage = () => (
  <div className="relative z-10 min-h-screen">
    <Navbar />
    <MonProfil />
    <Footer />
  </div>
);

export default MonProfilPage;
