import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ISSUE_LINK_MUTATION,
  DELETE_ISSUE_LINK_MUTATION,
  GET_ISSUE_QUERY,
} from '@/gql/gql-queries-mutations';
import type { Route } from 'next';
import { groupBy, lowerCase, startCase } from 'lodash';
import { BsPlus } from 'react-icons/bs';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { priorityToIcon } from '@/components/Icons';
import { Button } from '@/components/Button';
import { Issue } from '@/gql/__generated__/graphql';
import LinkIssueTypeDropdown from './LinkIssueTypeDropdown';
import LinkIssueSearch from './LinkIssueSearch';

type Links = {
  [key: string]: Issue[];
};

type LinkIssueCreate = {
  selectedIssue?: Issue;
  linkType?: string;
};

type IssueLink = {
  issueId: string;
  linkedIssueId: string;
  linkType: string;
};

const IssueLinkedIssues = ({
  issueId,
  projectKey,
}: {
  issueId?: string;
  projectKey?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [linkIssueCreate, setLinkIssueCreate] = useState<
    LinkIssueCreate | undefined
  >({});
  const { data, error, loading } = useQuery(GET_ISSUE_QUERY, {
    skip: !issueId,
    variables: { input: { id: issueId } },
  });
  const [createIssueLink] = useMutation(CREATE_ISSUE_LINK_MUTATION);
  const [deleteIssueLink] = useMutation(DELETE_ISSUE_LINK_MUTATION);

  const handleDeleteIssueLink = ({
    issueId,
    linkedIssueId,
    linkType,
  }: IssueLink) => {
    if (!issueId || !linkedIssueId || !linkType) {
      return;
    }

    return deleteIssueLink({
      refetchQueries: [
        {
          query: GET_ISSUE_QUERY,
          variables: { input: { id: issueId } },
        },
      ],
      variables: {
        input: {
          issueId,
          linkedIssueId,
          linkType,
        },
      },
    });
  };

  const handleCreateIssueLink = ({
    issueId,
    linkedIssueId,
    linkType,
  }: IssueLink) => {
    if (!issueId || !linkedIssueId || !linkType) {
      return;
    }

    return createIssueLink({
      onCompleted: () => {
        setShowCreateLink(false);
        setLinkIssueCreate({});
      },
      refetchQueries: [
        {
          query: GET_ISSUE_QUERY,
          variables: { input: { id: issueId } },
        },
      ],
      variables: {
        input: {
          issueId,
          linkedIssueId,
          linkType,
        },
      },
    });
  };

  const handleOpenIssue = ({ id }: { id: string }) => {
    if (!id) return;

    params.set('selectedIssueId', id);

    const newPath = pathname + '?' + params.toString();
    router.replace(newPath as Route);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading linked issues</div>;
  }

  const links: Links = data?.issue?.links
    ? groupBy(data.issue.links, 'linkType')
    : {};

  return (
    <>
      <div className='flex items-center justify-between align-middle'>
        <div className='text-2xl'>Linked Issues</div>
        <div
          className='rounded-md hover:cursor-pointer hover:bg-surface-overlay-hovered'
          onClick={() => {
            setShowCreateLink(true);
          }}
        >
          <BsPlus className='h-6 w-6' />
        </div>
      </div>
      {Object.keys(links).map((linkType) => (
        <div key={linkType}>
          <div className='pb-1 pt-2 text-lg opacity-80'>
            {startCase(lowerCase(linkType))}
          </div>
          {links[linkType].map(
            ({ id, title, priority, status, linkType, linkedIssueId }) => (
              <div
                key={id}
                className='group flex overflow-hidden rounded border border-primary/10 bg-surface-overlay px-2 shadow-sm hover:cursor-pointer hover:bg-surface-overlay-hovered'
              >
                <div className='relative m-1 flex w-full items-center gap-x-1 p-1'>
                  <div>
                    <CheckIcon className='h-6 w-6 text-blue-500' />
                  </div>
                  <div
                    className='text-link-active hover:underline'
                    onClick={() => handleOpenIssue({ id })}
                  >
                    {projectKey}-{id}
                  </div>
                  <div className='ml-4 shrink grow basis-0'>
                    <div className='flex'>
                      <div
                        className='grow hover:underline'
                        onClick={() => handleOpenIssue({ id })}
                      >
                        {title}
                      </div>
                    </div>
                  </div>
                  <div className='flex'>{priorityToIcon(Number(priority))}</div>
                  <div className='flex items-center justify-center rounded-md bg-blue-500 px-2 text-primary-inverted'>
                    {status?.name}
                  </div>
                  <div
                    className='right-0 opacity-0 hover:cursor-pointer hover:rounded-md hover:bg-surface-overlay group-hover:opacity-100'
                    onClick={() => {
                      if (!id || !linkedIssueId || !linkType) {
                        return;
                      }

                      handleDeleteIssueLink({
                        issueId: linkedIssueId,
                        linkedIssueId: id,
                        linkType,
                      });
                    }}
                  >
                    <XMarkIcon className='h-6 w-6' />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ))}
      {showCreateLink && (
        <>
          <div className='flex items-center gap-x-1 pt-2'>
            <LinkIssueTypeDropdown stateCallback={setLinkIssueCreate} />
            <div className='grow'>
              <LinkIssueSearch stateCallback={setLinkIssueCreate} />
            </div>
          </div>
          <div className='flex justify-between pt-1'>
            <div></div>
            <div className='space-x-1'>
              <Button
                variant='primary'
                onClick={() => {
                  if (
                    !issueId ||
                    !linkIssueCreate?.selectedIssue?.id ||
                    !linkIssueCreate?.linkType
                  ) {
                    return;
                  }

                  // TODO: there is a bug when you add a link to same issue twice it only shows last one
                  handleCreateIssueLink({
                    issueId: issueId,
                    linkedIssueId: linkIssueCreate.selectedIssue.id,
                    linkType: linkIssueCreate.linkType,
                  });
                }}
              >
                Link
              </Button>
              <Button
                variant='transparent'
                onClick={() => setShowCreateLink(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IssueLinkedIssues;
