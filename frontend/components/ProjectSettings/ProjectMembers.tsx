import { useQuery } from '@apollo/client';
import { GET_PROJECT_INFO } from '@/gql/gql-queries-mutations';
import { User } from '@/gql/__generated__/graphql';
import ProjectMemberInvite from '@/components/ProjectSettings/ProjectMemberInvite';

const ProjectMembers = ({ projectId }: { projectId: string }) => {
  const { data, loading, error } = useQuery(GET_PROJECT_INFO, {
    variables: {
      input: {
        id: projectId,
      },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='mt-2'>
      <ProjectMemberInvite projectId={projectId} />
    </div>
  );
};

export default ProjectMembers;
