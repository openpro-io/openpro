import { Button } from '@/components/KanbanBoard/Button';
import { useMutation } from '@apollo/client';
import { UPDATE_BOARD_MUTATION } from '@/gql/gql-queries-mutations';

const ResetBoardState = ({ boardId }: { boardId: string }) => {
  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);

  return (
    <Button
      className='float-right bg-red-500'
      onClick={() => {
        updateBoard({
          variables: {
            input: {
              id: boardId,
              viewState: '',
            },
          },
        });
      }}
    >
      Rebuild Board
    </Button>
  );
};

export default ResetBoardState;
