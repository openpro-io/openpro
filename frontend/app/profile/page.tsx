'use client';

import { useMutation } from '@apollo/client';
import React from 'react';

import { AvatarUploadComponent } from '@/components/Avatar';
import { UserInfo } from '@/components/Profile/UserInfo';
import {
  ASSIGN_ASSET_AS_AVATAR_MUTATION,
  UPLOAD_ASSET_MUTATION,
} from '@/gql/gql-queries-mutations';
import { base64toBlob } from '@/services/utils';

export default function Profile() {
  const [uploadAsset] = useMutation(UPLOAD_ASSET_MUTATION);
  const [assignAssetAsAvatar] = useMutation(ASSIGN_ASSET_AS_AVATAR_MUTATION);

  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log('SUBMIT');
  };

  const onAvatarSave = async (e: Event, image: string) => {
    e.preventDefault();

    // data:image/png;base64,iVBORw0KGgoAAAANSUhEUg
    if (image.startsWith('data')) {
      const mimeType = image.split(',')[0].split(';')[0].split(':')[1];

      const imageExtension = mimeType.replace('image/', '');

      const imageBlob = base64toBlob(
        image.replace(/^data:image\/\w+;base64,/, ''),
        mimeType
      );

      const imageFile = new File([imageBlob], `image.${imageExtension}`, {
        type: mimeType,
      });

      await uploadAsset({
        variables: {
          input: {
            assetExtension: imageExtension,
            file: imageFile,
          },
        },
        onCompleted: async (data) => {
          const assetId = data.uploadAsset.id;

          await assignAssetAsAvatar({
            variables: {
              input: {
                assetId,
              },
            },
            onCompleted: () => {
              console.log('Avatar assigned');
            },
          });
        },
      });
    }

    console.log('AVATAR SAVE');
  };

  return (
    <div className='md:flex md:items-center md:justify-between'>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <div className='col-span-1 col-start-1 text-3xl font-extrabold text-primary'>
            Profile
          </div>
          <p className='mt-1 text-sm leading-6 text-primary/60'>
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='col-span-full'>
              <h2 className='text-primary font-semibold leading-7 pb-4'>
                Avatar
              </h2>
              <AvatarUploadComponent onAvatarSave={onAvatarSave} />
            </div>
          </div>
        </div>

        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-primary font-semibold leading-7'>
            Personal Information
          </h2>
          <p className='mt-1 text-sm leading-6 text-primary/60'>
            Use a permanent address where you can receive mail.
          </p>

          <UserInfo />
        </div>
      </div>
    </div>
  );
}
