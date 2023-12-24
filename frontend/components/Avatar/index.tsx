import React from 'react';
// import Image from 'next/image';
import { classNames, formatUser } from '@/services/utils';
import { User } from '@/gql/__generated__/graphql';

const DefaultAvatar = ({ className }: { className?: string }) => (
  <span
    className={classNames(
      className,
      'inline-block h-4 w-4 overflow-hidden rounded-full bg-gray-100'
    )}
  >
    <svg
      className='h-full w-full text-gray-300'
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
    </svg>
  </span>
);

const Avatar = ({
  person,
  className,
}: {
  person: User | undefined;
  className?: string;
}) => {
  // TODO: Find cleaner way to handle this
  if (person?.avatarUrl && !person?.avatarUrl?.startsWith('http')) {
    person = formatUser(person);
  }

  if (!person?.avatarUrl?.startsWith('http')) {
    return <DefaultAvatar className={className} />;
  }

  return (
    // <Image
    //   src={person.avatarUrl}
    //   alt=''
    //   width={20}
    //   height={20}
    //   className={classNames(className, 'inline-block rounded-full bg-gray-50')}
    // />
    <img
      src={person.avatarUrl}
      alt=''
      width={20}
      height={20}
      className={classNames(className, 'inline-block rounded-full bg-gray-50')}
    />
  );
};

export default Avatar;

export * from './UploadComponent';
