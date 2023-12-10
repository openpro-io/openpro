import React from 'react';
import InputProps from './input.type';

const Input = ({
  name,
  value,
  placeholder,
  onChange,
  ...props
}: InputProps) => {
  return (
    <input
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className='block w-full rounded-md border-primary border-opacity-10 bg-transparent py-1.5 text-primary shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none sm:text-sm sm:leading-6'
      {...props}
    ></input>
  );
};

export default Input;
