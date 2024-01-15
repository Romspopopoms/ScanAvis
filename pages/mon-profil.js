import Footer from '../components';
import MonProfil from '../components/mon-profil';

const MonProfilPage = () => (
  <>
    <div className="gradient-01 fixed inset-0 z-0" />
    <div className="relative z-10 min-h-screen">
      <MonProfil />
      <Footer />
    </div>
  </>
);

export default MonProfilPage;
