import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      pageId: '7e1c489a-b53f-41a3-ac2d-5bb74a7a33ac',
      name: 'Geoffrey LAURENT',
      entreprise: 'Moi',
      google_business: 'Httpbbjebebjd',
      subscriptionItems: 'Bronze',
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
        window.location.href = 'Httpbbjebebjd';
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
          'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/Screenshot_2024-02-06-13-50-25-097-edit_com.whatsapp.jpg?raw=true")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="flex flex-col items-center">
        <img
          src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/images.jpeg?raw=true"
          alt="Logo"
          className="mb-6 h-12 w-12"
        />
        <h1 className="text-4xl text-white mb-4">Moi</h1>
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
