import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      pageId: '1bfda22c-366a-44ee-a464-dd751c581c32',
      name: 'Romain',
      entreprise: 'RFFZZ',
      google_business:
        "https://www.google.fr/maps/place/CAVE+DU+BEC+DE+L'AIGLE/@43.2023898,5.5900857,15z/data=!4m8!3m7!1s0x12c9a579159a93bb:0x8ee79d113715dfa2!8m2!3d43.2023893!4d5.6003857!9m1!1b1!16s%2Fg%2F11s7d2tjcz?entry=ttu",
      subscriptionItems: 'Gold',
    };

    try {
      const response = await fetch(
        'https://hook.eu2.make.com/y4k7i4onsckj63x4c7j1l51dqus6yu3q?',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        window.location.href =
          "https://www.google.fr/maps/place/CAVE+DU+BEC+DE+L'AIGLE/@43.2023898,5.5900857,15z/data=!4m8!3m7!1s0x12c9a579159a93bb:0x8ee79d113715dfa2!8m2!3d43.2023893!4d5.6003857!9m1!1b1!16s%2Fg%2F11s7d2tjcz?entry=ttu";
      } else {
        alert(
          'Une erreur est survenue lors de la soumission. Veuillez réessayer.',
        );
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la communication avec le serveur.');
    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/Bg.jpg?raw=true")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="flex flex-col items-center">
        <img
          src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/logosimple.png?raw=true"
          alt="Logo"
          className="mb-6 h-12 w-12"
        />
        <h1 className="text-4xl text-white mb-4">Kaoiur</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-75 rounded-lg p-4 shadow-lg mb-6"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
