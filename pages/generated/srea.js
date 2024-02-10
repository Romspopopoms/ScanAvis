import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      pageId: '3c1a24f4-2f0f-4be2-bb01-62594c83b0c3',
      name: 'Romain Santiago',
      entreprise: 'Moiiiz',
      google_business: 'https://maps.app.goo.gl/4B1tekbUygZvCcmb6',

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
        // Gérer le succès, par exemple afficher un message de succès
        alert('Merci pour votre soumission!');
      } else {
        // Gérer l'erreur, par exemple afficher un message d'erreur
        alert('Une erreur est survenue lors de la soumission.');
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
          src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/iconarrow.png?raw=true"
          alt="Logo"
          className="mb-6 h-12 w-12"
        />
        <h1 className="text-4xl text-white mb-4">Srea</h1>
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
          <a
            href="https://maps.app.goo.gl/4B1tekbUygZvCcmb6"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300 inline-block text-center"
          >
            Envoyer
          </a>
        </form>
      </div>
    </div>
  );
};

export default Page;
