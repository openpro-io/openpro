'use client';

import React, { useState } from 'react';
import Avatar from 'react-avatar-edit';
import { Button } from '@/components/Button';
import { useMutation } from '@apollo/client';
import {
  ASSIGN_ASSET_AS_AVATAR_MUTATION,
  UPLOAD_ASSET_MUTATION,
} from '@/gql/gql-queries-mutations';
import { UserInfo } from '@/components/Profile/UserInfo';

const AvatarUploadComponent = ({
  onAvatarSave,
}: {
  onAvatarSave: (e: Event, image: string) => Promise<void>;
}) => {
  const [preview, setPreview] = useState(null);
  function onClose() {
    setPreview(null);
  }
  function onCrop(pv: any) {
    setPreview(pv);
  }
  function onBeforeFileLoad(elem: any) {
    // TODO: How big is too big? Lets use a config value
    // if (elem.target.files[0].size > 5000000) {
    //   alert('File is too big!');
    //   elem.target.value = '';
    // }
  }

  return (
    <div className='flex flex-row space-x-1'>
      <Avatar
        width={600}
        height={300}
        onCrop={onCrop}
        onClose={onClose}
        onBeforeFileLoad={onBeforeFileLoad}
        src={undefined}
      />
      <br />
      {preview && (
        <div className='flex flex-col justify-center align-top'>
          <img src={preview} alt='Preview' className='h-32 w-32' />
          <Button
            text='Save'
            onClick={(e) => {
              onAvatarSave(e, preview).then(() => {
                onClose();
              });
            }}
            classes='justify-center'
          />
        </div>
      )}
    </div>
  );
};

function base64toBlob(base64Data: string, contentType: string): Blob {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

const Profile = () => {
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
          <div className='col-span-1 col-start-1 text-3xl font-extrabold text-black dark:text-white'>
            Profile
          </div>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Username
              </label>
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <span className='flex select-none items-center pl-3 text-gray-500 sm:text-sm'>
                    user/
                  </span>
                  <input
                    type='text'
                    name='username'
                    id='username'
                    autoComplete='username'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder='janesmith'
                  />
                </div>
              </div>
            </div>

            <div className='col-span-full'>
              <AvatarUploadComponent onAvatarSave={onAvatarSave} />
            </div>
          </div>
        </div>

        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Personal Information
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Use a permanent address where you can receive mail.
          </p>

          <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default Profile;
