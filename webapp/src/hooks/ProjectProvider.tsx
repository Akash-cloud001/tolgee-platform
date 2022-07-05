import React, { createContext } from 'react';
import { useEffect } from 'react';
import { FullPageLoading } from 'tg.component/common/FullPageLoading';
import { GlobalError } from '../error/GlobalError';
import { components } from '../service/apiSchema.generated';
import { useApiQuery } from '../service/http/useQueryApi';
import { useUpdateCurrentOrganization } from './CurrentOrganizationProvider';

export const ProjectContext = createContext<
  components['schemas']['ProjectModel'] | null
>(null);

export const ProjectProvider: React.FC<{ id: number }> = ({ id, children }) => {
  const { isLoading, data, error } = useApiQuery({
    url: '/v2/projects/{projectId}',
    method: 'get',
    path: { projectId: id },
  });

  const updateOrganization = useUpdateCurrentOrganization();

  useEffect(() => {
    if (data?.organizationOwner) {
      updateOrganization(data.organizationOwner.id);
    }
  }, [data]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (data) {
    return (
      <ProjectContext.Provider value={data}>{children}</ProjectContext.Provider>
    );
  }

  throw new GlobalError(
    'Unexpected error occurred',
    error?.code || 'Loadable error'
  );
};
