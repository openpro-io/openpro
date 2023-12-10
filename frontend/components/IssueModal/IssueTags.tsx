import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

import { useFragment, useMutation, useQuery } from '@apollo/client';
import {
  CREATE_PROJECT_TAG_MUTATION,
  GET_PROJECT_TAGS,
  ISSUE_FIELDS,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import { useParams, useSearchParams } from 'next/navigation';
import { isEqual } from 'lodash';

type OptionType = {
  label: string;
  value: string;
};

const menuStyles = '!bg-surface !text-primary';
const controlStyles = '!bg-transparent !text-primary !h-12';

const IssueTags = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [value, setValue] = useState<OptionType[] | undefined>();
  const urlParams = useParams();
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);

  const issueId = urlParams?.issueId ?? params.get('selectedIssueId');
  const projectId = urlParams.projectId;

  const getProjectTags = useQuery(GET_PROJECT_TAGS, {
    skip: !projectId,
    variables: { input: { projectId } },
  });
  const getIssueFragment = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: issueId,
    },
  });
  const [createProjectTag] = useMutation(CREATE_PROJECT_TAG_MUTATION);
  const [updateIssue, { loading: isSaving }] = useMutation(
    UPDATE_ISSUE_MUTATION
  );

  // Set the initial options from the server
  useEffect(() => {
    if (getProjectTags?.data) {
      const projectTags = getProjectTags?.data?.projectTags;
      setOptions(
        projectTags?.map((tag: any) => ({ label: tag.name, value: tag.id }))
      );
    }

    setIsLoading(false);
  }, [getProjectTags.data]);

  useEffect(() => {
    if (getIssueFragment?.data) {
      const issueTags = getIssueFragment?.data?.tags;
      setValue(
        issueTags?.map((tag: any) => ({ label: tag.name, value: tag.id }))
      );
    }
  }, [getIssueFragment.data]);

  // Update the database when the value changes
  useEffect(() => {
    if (value) {
      const currentTagIds = getIssueFragment?.data?.tags?.map(
        (tag: any) => tag.id
      );
      const incomingTagIds = value.map((tag) => tag.value);
      const areTagsEqual = isEqual(currentTagIds, incomingTagIds);

      if (!areTagsEqual) {
        updateIssue({
          variables: {
            input: {
              id: issueId,
              tagIds: value.map((tag) => tag.value),
            },
          },
        });
      }
    }
  }, [value]);

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    const createProjectTagResponse = await createProjectTag({
      variables: {
        input: {
          name: inputValue,
          projectId,
        },
      },
    });

    const newOption: OptionType = {
      label: createProjectTagResponse.data.createProjectTag.name,
      value: createProjectTagResponse.data.createProjectTag.id,
    };

    setIsLoading(false);

    // This pushes into selectable options list
    setOptions((prev) => [...prev, newOption]);

    // This sets the value of the select
    setValue(value ? [...value, newOption] : [newOption]);
  };

  const handleMultiValueClick = (e: Event, props: any) => {
    e.stopPropagation();
    e.preventDefault();

    // console.log('A multi value has been clicked', props);

    const option = options.find((option) => option.value === props.data.value);
    // option.label, option.value

    // console.log({ option });
    //   TODO: Lets show an issue view with all issues with this tag
  };

  const MultiValueLabel = (props: any) => {
    return (
      // @ts-ignore
      <div onClick={(e) => handleMultiValueClick(e, props)}>
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  return (
    <div>
      <CreatableSelect
        isClearable
        isMulti
        name='issue-tags'
        onChange={(newValue) => setValue(newValue as OptionType[])}
        options={options}
        isDisabled={isLoading || isSaving}
        isLoading={isLoading}
        onCreateOption={handleCreate}
        components={{ MultiValueLabel }}
        openMenuOnClick={false}
        value={value}
        classNamePrefix='select'
        classNames={{
          control: () => controlStyles,
          menu: () => menuStyles,
        }}
      />
    </div>
  );
};

export default IssueTags;
