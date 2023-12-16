import { useCallback, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

import { useQuery } from '@apollo/client';
import { GET_PROJECT_TAGS } from '@/gql/gql-queries-mutations';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Route } from 'next';

type OptionType = {
  label: string;
  value: string;
};

const menuStyles = '!bg-surface !text-primary';
const controlStyles = '!bg-transparent !text-primary';

const LabelFilter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [value, setValue] = useState<OptionType[] | undefined>();
  const urlParams = useParams();
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const pathname = usePathname();

  const projectId = urlParams.projectId;

  const getProjectTags = useQuery(GET_PROJECT_TAGS, {
    skip: !projectId,
    variables: { input: { projectId } },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    let url = pathname;

    if (value && value.length > 0) {
      const tags = value.map((tag) => tag.value);
      url = pathname + '?' + createQueryString('tagIds', tags.join(','));
    }

    router.replace(url as Route);
  }, [value]);

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

  const handleMultiValueClick = (e: Event, props: any) => {
    e.stopPropagation();
    e.preventDefault();

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
        name='project-tags'
        placeholder='Filter by label...'
        onChange={(newValue) => setValue(newValue as OptionType[])}
        options={options}
        isDisabled={isLoading}
        isLoading={isLoading}
        components={{ MultiValueLabel }}
        openMenuOnClick={false}
        value={value}
        classNames={{
          control: () => controlStyles,
          menu: () => menuStyles,
        }}
        classNamePrefix='select'
      />
    </div>
  );
};

export default LabelFilter;
