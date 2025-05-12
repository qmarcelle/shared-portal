import React from 'react';

interface ButtonProps {
  label: string;
  callback?: () => void;
  style?: 'primary' | 'secondary' | 'submit' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  callback,
  style = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const getButtonStyle = () => {
    switch (style) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'submit':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <button
      type={type}
      onClick={callback}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full ${getButtonStyle()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {label}
    </button>
  );
};