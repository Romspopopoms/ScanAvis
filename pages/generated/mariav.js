import React from 'react';

const Page = () => (
  <div
    className="bg-cover bg-center h-screen"
    style={{
      backgroundImage:
        'url("https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/planet-06.png?raw=true")',
    }}
  >
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src="https://github.com/Romspopopoms/ScanAvis/blob/main/uploaded_images/whats-new.png?raw=true"
        alt="Logo"
        className="mb-4"
      />
      <h1 className="text-4xl text-white mb-4">Mariav</h1>
      <div className="bg-white opacity-75 rounded p-4">
        <input
          type="email"
          placeholder="Entrez votre email"
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  </div>
);

export default Page;
