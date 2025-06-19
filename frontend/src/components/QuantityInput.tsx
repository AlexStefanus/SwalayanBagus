import React from 'react';
import TrashIcon from './TrashIcon';

export interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  className?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, onQuantityChange, className }) => {
  
  const handleDecrement = () => {
    onQuantityChange(quantity - 1);
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onQuantityChange(0); 
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        onQuantityChange(numValue);
      }
    }
  };

  return (
    <div className={`flex items-center rounded-md border border-gray-300 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 0}
        className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
      >
        {quantity === 1 ? <TrashIcon className="w-4 h-4 text-red-500" /> : '-'}
      </button>
      <input
        type="text"
        value={quantity === 0 ? '' : quantity}
        onChange={handleInputChange}
        className="w-full text-center border-l border-r border-gray-300 py-1"
        aria-label="Kuantitas produk"
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;