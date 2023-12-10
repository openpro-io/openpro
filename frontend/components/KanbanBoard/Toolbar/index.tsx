import SearchFilter from '@/components/KanbanBoard/SearchFilter';
import LabelFilter from '@/components/KanbanBoard/LabelFilter';
import { Button } from '@/components/Button';

type Props = {
  setShowAddContainerModal: (args: any) => void;
};

const Toolbar = ({ setShowAddContainerModal }: Props) => {
  return (
    <div className='flex items-center gap-y-2 pt-3 align-middle'>
      <div className='flex shrink grow basis-0 space-x-2'>
        <div>
          <SearchFilter />
        </div>

        <div className='w-72'>
          <LabelFilter />
        </div>
      </div>
      <div className=''>
        <Button onClick={() => setShowAddContainerModal(true)}>
          Add Container
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
