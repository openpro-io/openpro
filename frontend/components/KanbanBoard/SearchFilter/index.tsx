import Input from '@/components/KanbanBoard/Input';
import { useCallback, useEffect, useState } from 'react';
import { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SearchFilter = () => {
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // This controls the search query param from the main dashboard
  // TODO: move this to search component
  useEffect(() => {
    let url = pathname;

    if (search !== '') {
      url = pathname + '?' + createQueryString('text', search);
    }

    router.replace(url as Route);
  }, [search]);

  return (
    <Input
      type='search'
      name='search'
      placeholder='Search'
      className='h-9.5 w-64 rounded-sm border border-gray-200 bg-transparent'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchFilter;
