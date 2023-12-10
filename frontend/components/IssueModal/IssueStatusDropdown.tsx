'use client';

import React, { Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/services/utils';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  GET_ISSUE_QUERY,
  GET_ISSUE_STATUSES_FOR_PROJECT,
  GET_PROJECT_INFO,
  UPDATE_BOARD_MUTATION,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import { IssueStatus } from '@/constants/types';
import { useParams } from 'next/navigation';

const IssueStatusDropdown = ({
  projectId,
  issueId,
}: {
  projectId: string;
  issueId: string;
}) => {
  const urlParams = useParams();

  const boardId = urlParams?.boardId;

  const getIssueStatuses = useQuery(GET_ISSUE_STATUSES_FOR_PROJECT, {
    skip: !projectId,
    variables: { input: { id: `${projectId}` } },
  });

  const getIssue = useQuery(GET_ISSUE_QUERY, {
    skip: !issueId,
    variables: { input: { id: `${issueId}` } },
  });

  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const [updateIssue, { called, reset }] = useMutation(UPDATE_ISSUE_MUTATION, {
    refetchQueries: [
      {
        query: GET_PROJECT_INFO,
        variables: {
          input: {
            id: `${projectId}`,
          },
        },
      },
    ],
    update(cache, { data: { updateIssue } }) {
      cache.modify({
        fields: {
          issues(existingIssues = []) {
            const newIssueRef = cache.writeFragment({
              data: updateIssue,
              fragment: gql`
                fragment UpdateIssueStatus on Issue {
                  id
                  status {
                    id
                    name
                  }
                }
              `,
            });
            return [...existingIssues, newIssueRef];
          },
        },
      });
    },
  });

  // TODO: !! Fix this to just push to the end of the viewState array for the destination status column
  useEffect(() => {
    if (called && boardId) {
      updateBoard({
        variables: {
          input: {
            id: `${boardId}`,
            viewState: '',
          },
        },
      });

      reset();
    }
  }, [called]);

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <Menu.Button className='inline-flex w-full justify-center gap-x-1 rounded-md border border-primary/20 px-3 py-2 text-sm font-semibold shadow-sm'>
        {getIssue?.data?.issue?.status?.name}
        <ChevronDownIcon className='-mr-1 h-5 w-5' aria-hidden='true' />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute left-0 z-10 mt-1 w-56 origin-top-right rounded-md border border-primary/20 bg-surface-overlay shadow-lg focus:outline-none'>
          <div className='py-1'>
            {getIssueStatuses?.data?.project?.issueStatuses
              .filter(
                (is: IssueStatus) =>
                  is.name !== getIssue?.data?.issue?.status?.name
              )
              .map((is: IssueStatus) => (
                <Menu.Item
                  as='a'
                  key={is.id}
                  onClick={() => {
                    return updateIssue({
                      variables: {
                        input: {
                          id: issueId,
                          issueStatusId: is.id,
                        },
                      },
                    });
                  }}
                  className='ui-active:bg-surface-overlay-hovered block px-4 py-2 text-sm ui-active:text-link-active ui-not-active:text-link'
                >
                  {is.name}
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default IssueStatusDropdown;
