'use client';
import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;
    const body = window.document.body;

    if (colorMode === 'dark') {
      bodyClass.add(className);
      body.setAttribute('data-theme', 'dark');
    } else {
      bodyClass.remove(className);
      body.removeAttribute('data-theme');
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
