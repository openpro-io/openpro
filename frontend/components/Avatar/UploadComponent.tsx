import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { Button } from '@/components/Button';

const Avatar = dynamic(() => import('react-avatar-edit'), { ssr: false });

export const AvatarUploadComponent = ({
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
    <div className='flex flex-row space-x-1 text-primary hover:cursor-pointer'>
      <Avatar
        width={600}
        height={300}
        onCrop={onCrop}
        onClose={onClose}
        onBeforeFileLoad={onBeforeFileLoad}
        src={undefined}
        labelStyle={{ color: undefined }}
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
