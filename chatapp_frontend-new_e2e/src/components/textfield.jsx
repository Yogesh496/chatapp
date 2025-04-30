import React from 'react';

const TextField = ({ label, name, value, onChange, type = "text", placeholder, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-black text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-white`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextField;
