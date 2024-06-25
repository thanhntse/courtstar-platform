import React from 'react';

const NoPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-4">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="text-blue-600 hover:underline transition duration-300"
      >
        Go to Home
      </a>
    </div>
  );
};

export default NoPage;
