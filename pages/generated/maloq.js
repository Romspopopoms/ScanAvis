import React from 'react';

const Page = () => (
  <div
    className="relative bg-cover bg-center h-screen flex items-center justify-center"
    style={{
      backgroundImage:
        'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/planet-06.png?raw=true")',
    }}
  >
    <div className="flex flex-col items-center">
      <img
        src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/whats-new.png?raw=true"
        alt="Logo"
        className="mb-8 w-32 h-auto"
      />
      <h1 className="text-5xl text-white mb-8">Maloq</h1>
      <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg mb-8">
        <input
          type="email"
          placeholder="Entrez votre email"
          className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button className="bg-transparent border border-white text-white py-2 px-6 rounded-full hover:bg-white hover:text-black transition-all duration-300 ease-in-out shadow-lg">
        Envoyer
      </button>
    </div>
  </div>
);

export default Page;
