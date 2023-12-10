import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ISSUE_QUERY,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import { useEffect, useState } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';

const IssueTitle = ({ issueId }: { issueId?: string }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [issueTitle, setIssueTitle] = useState<string | undefined>('');
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = issueId ?? params.get('selectedIssueId');

  const { data, error, refetch } = useQuery(GET_ISSUE_QUERY, {
    skip: !selectedIssueId,
    variables: { input: { id: selectedIssueId } },
  });
  const [updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);

  useEffect(() => {
    setIssueTitle(data?.issue?.title);
  }, [data]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // onBlur handles the save
    e.preventDefault();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueTitle(e.target.value);
  };

  const onFocus = () => {
    setIsInputFocused(true);
  };

  const onBlur = () => {
    setIsInputFocused(false);

    // Only perform the save operation if the cancel button was not clicked
    if (!isCancelClicked) {
      if (issueTitle === data?.issue?.title || issueTitle === '') return;

      updateIssue({
        variables: {
          input: {
            id: selectedIssueId,
            title: issueTitle,
          },
        },
      })
        .catch((error) => {
          console.error('Unable to send issue title update mutation: ', error);
        })
        .finally(() => {
          setIsInputFocused(false);
        });
    }

    // Reset the isCancelClicked state variable
    setIsCancelClicked(false);
  };

  const cancel = () => {
    setIsCancelClicked(true);

    // Restore the current DB value for the title
    refetch().then(({ data }) => {
      setIssueTitle(data?.issue?.title);
    });

    setIsInputFocused(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='title'
          id='title'
          className='block w-full border-0 bg-transparent py-1.5 text-lg font-semibold placeholder:text-gray-400 hover:bg-surface-overlay-hovered focus:ring-2 focus:ring-inset focus:ring-blue-500'
          value={issueTitle ?? data?.issue?.title ?? ''}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {isInputFocused && (
          <div className='float-right flex space-x-1'>
            <button
              type='submit'
              className='border-1 mt-2 flex h-8 w-8 items-center justify-center border shadow-lg'
            >
              <LuCheck className='h-4 w-4' />
            </button>
            <button
              type='button'
              onMouseDown={() => cancel()}
              className='border-1 mt-2 flex h-8 w-8 items-center justify-center border shadow-lg'
            >
              <LuX className='h-4 w-4' />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default IssueTitle;
