import React, { useEffect } from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../Button';
import { classNames } from '@/services/utils';
import { BsArrowsMove } from 'react-icons/bs';

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={classNames(
        'bg-kanban-column flex h-full w-full min-w-72 flex-col gap-y-4 rounded-xl p-4',
        isDragging && 'opacity-50'
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-1'>
          <h1 className='text-xl'>{title}</h1>
          <p className='text-sm'>{description}</p>
        </div>
        <button
          className='rounded-xl border p-2 text-xs shadow-lg hover:shadow-xl'
          {...listeners}
        >
          <BsArrowsMove className='h-4 w-4' />
        </button>
      </div>

      {children}
      <Button variant='ghost' onClick={onAddItem}>
        Add Issue
      </Button>
    </div>
  );
};

export default Container;
