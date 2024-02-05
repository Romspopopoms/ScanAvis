import React from 'react';

const Page = () => (
  <div
    className="relative bg-cover bg-center h-screen flex items-center justify-center"
    style={{
      backgroundImage: 'url("null")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
    }}
  >
    <div className="flex flex-col items-center">
      <img src="null" alt="Logo" className="mb-6 h-12 w-12" />
      <h1 className="text-4xl text-white mb-4">Mariav</h1>
      <div className="bg-white bg-opacity-75 rounded-lg p-4 shadow-lg mb-6">
        <input
          type="email"
          placeholder="Entrez votre email"
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300"
      >
        Envoyer
      </button>
    </div>
  </div>
);

export default Page;
