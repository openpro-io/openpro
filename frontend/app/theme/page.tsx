'use client';
import React from 'react';
import { Button } from '@/components/Button';

// @ts-ignore
const Theme = () => {
  return (
    <div className='flex flex-col'>
      <div className='pb-2 text-3xl'>Buttons</div>
      <div className='flex flex-row space-x-5'>
        <Button>Primary</Button>
        <Button variant='gray'>Gray</Button>
        <Button variant='transparent'>Transparent</Button>
      </div>
    </div>
  );
};

export default Theme;
