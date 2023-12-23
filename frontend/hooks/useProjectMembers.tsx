import { useMutation } from '@apollo/client';
import {
  ADD_USER_TO_PROJECT_MUTATION,
  REMOVE_USER_FROM_PROJECT_MUTATION,
  GET_PROJECT_INFO,
} from '@/gql/gql-queries-mutations';
import { User } from '@/gql/__generated__/graphql';

const useProjectMembers = (projectId: string) => {
  const [addUserToProject] = useMutation(ADD_USER_TO_PROJECT_MUTATION, {
    refetchQueries: [
      {
        query: GET_PROJECT_INFO,
        variables: {
          input: {
            id: projectId,
          },
        },
      },
    ],
  });

  const [removeUserFromProject] = useMutation(
    REMOVE_USER_FROM_PROJECT_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_PROJECT_INFO,
          variables: {
            input: {
              id: projectId,
            },
          },
        },
      ],
    }
  );

  const handleAddMember = (user: User) => {
    return addUserToProject({
      variables: {
        input: {
          projectId,
          userId: user.id,
        },
      },
    });
  };

  const handleRemoveMember = (user: User) => {
    return removeUserFromProject({
      variables: {
        input: {
          projectId,
          userId: user.id,
        },
      },
    });
  };

  return { handleAddMember, handleRemoveMember };
};

export default useProjectMembers;
