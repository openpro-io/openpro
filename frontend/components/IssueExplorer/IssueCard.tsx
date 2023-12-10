'use client';
import { classNames } from '@/services/utils';
import { User } from '@/constants/types';
import { useFragment } from '@apollo/client';
import { ISSUE_FIELDS } from '@/gql/gql-queries-mutations';
import Avatar from '@/components/Avatar';
import Link from 'next/link';

const IssueCard = ({
  projectId,
  projectKey,
  id,
  assignee,
}: {
  projectId: string;
  projectKey?: string;
  id: string;
  assignee?: User | undefined;
}) => {
  // const getIssue = useQuery(GET_ISSUE_QUERY, {
  //   fetchPolicy: 'cache-only',
  //   skip: !id,
  //   variables: { input: { id } },
  // });
  // TODO: This is a hack to get around the fact that useQuery doesn't work with fragments

  const { data } = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: id,
    },
  });

  // TODO: We can do on click in here if we want to open a modal as well or in the parent
  return (
    <Link href={`/projects/${projectId}/issues/${id}`}>
      <div className='bg-kanban-card m-2 rounded border-2 border-gray-300 p-3 text-sm shadow-lg'>
        <div className=''>{data?.title}</div>
        <div className='flex w-full items-center justify-between space-x-1'>
          <div className='flex-1 truncate'>
            <div className='flex items-center space-x-3'>
              <h3
                className={classNames(
                  data?.status?.name?.toLowerCase() === 'done'
                    ? 'line-through'
                    : '',
                  'truncate text-sm font-medium tracking-wide'
                )}
              >
                {projectKey}-{id}
              </h3>
            </div>
          </div>

          <Avatar person={data?.assignee} className='h-6 w-6' />
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
