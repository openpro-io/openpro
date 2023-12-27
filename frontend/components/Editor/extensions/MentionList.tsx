// import './MentionList.scss';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { classNames } from '@/services/utils';
import { User } from '@/gql/__generated__/graphql';

const cssItems =
  'flex flex-col relative overflow-hidden rounded-lg bg-surface p-2 text-sm text-primary shadow-sm';

const cssItem =
  'bg-transparent border border-transparent rounded-md block m-0 px-1 py-0 text-left w-full hover:bg-surface-overlay-hovered';

type Props = {
  items: User[];
  command: (options: { id: string }) => void;
};

const MentionList = forwardRef((props: Props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    // This displays the name of the user in the editor when selected
    const item = props.items[index].name;

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: any }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  // This is the component that displays the list of users when @ is typed
  return (
    <div className={classNames(cssItems)}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={classNames(
              cssItem,
              index === selectedIndex ? 'border-black' : ''
            )}
            key={item.id}
            onClick={() => selectItem(index)}
          >
            {item.name}
          </button>
        ))
      ) : (
        <div className={classNames(cssItem)}>No result</div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
