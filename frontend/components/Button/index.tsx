import React from 'react';
import { classNames } from '@/services/utils';

export const Button = ({
  text,
  variant,
  onClick,
  classes,
  children,
  type = 'button',
}: {
  text?: string;
  variant?: 'primary' | 'gray' | 'transparent';
  onClick?: (args?: any) => void;
  classes?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
}) => {
  let buttonClasses = '';

  switch (variant) {
    case 'gray':
      buttonClasses =
        'bg-neutral hover:bg-neutral-hovered text-primary active:bg-neutral-pressed';
      break;

    case 'transparent':
      buttonClasses =
        'bg-transparent hover:bg-neutral-hovered text-primary active:bg-neutral-pressed';
      break;

    default:
      buttonClasses =
        'bg-blue-bold hover:bg-blue-bold-hovered active:bg-neutral-pressed text-primary-inverted';
      break;
  }

  return (
    <button
      type={type}
      className={classNames(
        `${buttonClasses} inline-flex items-center justify-self-center rounded-md px-3 py-2 align-middle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
        classes
      )}
      onClick={onClick}
    >
      {text ?? children}
    </button>
  );
};
