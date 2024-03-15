import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      pageId: '43b0cadf-aa64-4d1f-aae1-0cfae89895ad',
      name: 'Romain Santiago',
      entreprise: 'Jean-Jacque',
      google_business:
        'https://www.google.fr/maps/place/Sport+D%C3%A9couverte/@43.2078327,5.5884013,15z/data=!4m6!3m5!1s0x12c9a5b412c6f2d5:0x38fd2c8210624f50!8m2!3d43.2078324!4d5.5987005!16s%2Fg%2F11hfx1587j?entry=tts',
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
          'https://www.google.fr/maps/place/Sport+D%C3%A9couverte/@43.2078327,5.5884013,15z/data=!4m6!3m5!1s0x12c9a5b412c6f2d5:0x38fd2c8210624f50!8m2!3d43.2078324!4d5.5987005!16s%2Fg%2F11hfx1587j?entry=tts';
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
          src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/web.png?raw=true"
          alt="Logo"
          className="mb-6 h-12 w-12"
        />
        <h1 className="text-4xl text-white mb-4">Scan'Avis</h1>
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
