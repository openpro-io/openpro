import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import UserSelectionDropdown from '@/components/UserSelectionDropdown';
import {
  GET_ISSUE_QUERY,
  ISSUE_FIELDS,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import { useFragment, useMutation, useQuery } from '@apollo/client';
import { User } from '@/constants/types';
import { DateTime } from 'luxon';
import IssueTags from '@/components/IssueModal/IssueTags';
import IssuePriorityDropdown from '@/components/IssuePriorityDropdown';

/**
 * Returns the actual or relative timestamp based on the given timestamp and options.
 *
 * @param {number} timestamp - The timestamp to convert.
 * @param {Object} options - The options for converting the timestamp (optional).
 * @param {number} options.showRelativeDaysMin - The minimum number of days to show a relative timestamp (default is 5). -1 will always return full date.
 * @return {string|null} - The actual or relative timestamp.
 */
const returnActualOrRelativeTimestamp = (
  timestamp: number,
  { showRelativeDaysMin = 5 }: { showRelativeDaysMin?: number } = {}
): string | null => {
  if (!timestamp) return null;

  const ts = DateTime.fromMillis(Number(timestamp));
  const now = DateTime.local();
  const diffInDays = Math.floor(now.diff(ts, 'days').days);
  const fullDateFormat = "LLLL d, yyyy 'at' h:mm a";

  return diffInDays > showRelativeDaysMin
    ? ts.toFormat(fullDateFormat)
    : ts.toRelative();
};

const IssueDetails = ({
  projectId,
  issueId,
}: {
  projectId: string;
  issueId: string;
}) => {
  const [updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);

  const getIssueFragment = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: issueId,
    },
  });

  const issueDetails = {
    issue: getIssueFragment.data,
  };

  const updateIssueUser = (user: User, type: 'assignee' | 'reporter') => {
    const incomingUserId = Number(user.id || 0);
    const currentUserId = Number(issueDetails?.issue?.[type]?.id ?? 0);

    if (incomingUserId !== currentUserId) {
      console.log(`UPDATE ${type} from ${currentUserId} to ${incomingUserId}`);
      updateIssue({
        variables: {
          input: {
            id: issueId,
            [`${type}Id`]: user.id,
          },
        },
      });
    }
  };

  return (
    <>
      <div className='mt-5 w-full rounded-lg border border-primary/20'>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className='text-md flex w-full justify-between rounded-t-lg border-b border-primary/20 bg-surface-overlay-hovered px-3 py-3 text-left font-medium focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75'>
                <span>Details</span>
                <ChevronDownIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                />
              </Disclosure.Button>
              <Transition
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                <Disclosure.Panel className='w-full space-y-5 px-4 pb-5 pt-4 text-xs font-semibold'>
                  <div className='flex flex-row'>
                    <div className='basis-1/4'>Assignee</div>
                    <div className='w-full'>
                      <UserSelectionDropdown
                        initialPerson={issueDetails?.issue?.assignee}
                        selectedPersonCallback={(user) =>
                          updateIssueUser(user, 'assignee')
                        }
                      />
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <div className='basis-1/4'>Labels</div>
                    <div className='w-full'>
                      <IssueTags />
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <div className='basis-1/4'>Reporter</div>
                    <div className='w-full'>
                      <UserSelectionDropdown
                        initialPerson={issueDetails?.issue?.reporter}
                        selectedPersonCallback={(user) =>
                          updateIssueUser(user, 'reporter')
                        }
                      />
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <div className='basis-1/4'>Priority</div>
                    <div className='w-full'>
                      {issueDetails?.issue && (
                        <IssuePriorityDropdown
                          initialPriorityId={issueDetails?.issue?.priority}
                          onChange={(priority) => {
                            if (priority.id !== issueDetails?.issue?.priority) {
                              return updateIssue({
                                variables: {
                                  input: {
                                    id: issueId,
                                    priority: Number(priority.id),
                                  },
                                },
                              });
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
      <div className='space-y-1 pl-5 pt-2 text-xs'>
        <div>
          Created At:{' '}
          {returnActualOrRelativeTimestamp(issueDetails?.issue?.createdAt)}
        </div>
        <div>
          Updated At:{' '}
          {returnActualOrRelativeTimestamp(issueDetails?.issue?.updatedAt)}
        </div>
      </div>
    </>
  );
};

export default IssueDetails;
