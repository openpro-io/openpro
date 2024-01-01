export type ViewStateIssueStatus = {
  id: string;
  name: string;
  projectId: string;
};

export type ViewStateItem = {
  id: string;
  title: string;
  status?: ViewStateIssueStatus;
};

export type ViewState = {
  id: string;
  items: ViewStateItem[];
  title: string;
};

export type Board = {
  id: string;
  name: string;
  projectId: string;
  style: string;
  status: string;
  viewState?: ViewState[];
  backlogEnabled?: Boolean;
  createdAt: string;
  updatedAt?: string;
  settings?: string;
  columns?: [string];
};

export type ProjectTag = {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  description?: string;
  imageId?: string;
  status?: string;
  boards?: Board[];
  issueStatuses?: IssueStatus[];
  issues?: Issue[];
  tags: ProjectTag[];
  createdAt: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  externalId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  name?: string;
  fullAvatarUrl?: string | null;
};

export type Issue = {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  boardId?: string;
  issueType: string;
  assignee?: User;
};

export type IssueStatus = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
};

export type CreateProjectDetails = {
  name: string;
  key: string;
  visibility: string;
};

export type CreateProjectType = {
  projectTypeName: string;
  projectTypeDescription: string;
  projectTypeIcon: string;
};

export type CreateProject = CreateProjectType & CreateProjectDetails;

export type EditorContent = {
  content: any;
  state: any;
};
