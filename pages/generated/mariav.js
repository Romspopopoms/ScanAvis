import React from 'react';

const Page = () => (
  <div
    className="bg-cover bg-center h-screen"
    style={{
      backgroundImage:
        'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/get-started.jpg?raw=true")',
    }}
  >
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/people-01.png?raw=true"
        alt="Logo"
        className="mb-6 w-20 h-auto"
      />
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
