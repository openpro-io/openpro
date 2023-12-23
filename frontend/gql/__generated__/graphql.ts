/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Asset = {
  __typename?: 'Asset';
  assetPath?: Maybe<Scalars['String']['output']>;
  assetSubType?: Maybe<Scalars['String']['output']>;
  assetType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ownerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type AssignAssetAsAvatarInput = {
  assetId: Scalars['String']['input'];
};

export type Board = {
  __typename?: 'Board';
  backlogEnabled?: Maybe<Scalars['Boolean']['output']>;
  columns?: Maybe<Array<Maybe<Column>>>;
  containerOrder?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  issues?: Maybe<Array<Maybe<Issue>>>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  viewState?: Maybe<Array<Maybe<ViewState>>>;
};

export enum BoardStyle {
  Kanban = 'KANBAN',
  Scrum = 'SCRUM'
}

export type Column = {
  __typename?: 'Column';
  id: Scalars['ID']['output'];
  issues?: Maybe<Array<Maybe<Issue>>>;
  title: Scalars['String']['output'];
};

export type CreateBoardInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  style?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIssueCommentInput = {
  comment: Scalars['String']['input'];
  issueId: Scalars['String']['input'];
};

export type CreateIssueInput = {
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  boardId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  issueStatusId?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateIssueLinkInput = {
  issueId: Scalars['String']['input'];
  linkType: Scalars['String']['input'];
  linkedIssueId: Scalars['String']['input'];
};

export type CreateIssueStatusInput = {
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type CreateProjectInput = {
  boardName: Scalars['String']['input'];
  boardStyle: BoardStyle;
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  visibility?: InputMaybe<ProjectVisibility>;
};

export type CreateProjectTagInput = {
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type CreateProjectValidationInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteAssetInput = {
  assetId: Scalars['String']['input'];
};

export type DeleteIssueInput = {
  id: Scalars['String']['input'];
};

export type DeleteIssueLinkInput = {
  issueId: Scalars['String']['input'];
  linkType: Scalars['String']['input'];
  linkedIssueId: Scalars['String']['input'];
};

export type DeleteProjectTagInput = {
  id: Scalars['String']['input'];
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimetype: Scalars['String']['output'];
};

export type Issue = {
  __typename?: 'Issue';
  archived?: Maybe<Scalars['Boolean']['output']>;
  assignee?: Maybe<User>;
  comments?: Maybe<Array<Maybe<IssueComment>>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  linkType?: Maybe<Scalars['String']['output']>;
  linkedIssueId?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Maybe<Issue>>>;
  priority?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars['String']['output']>;
  reporter?: Maybe<User>;
  status?: Maybe<IssueStatus>;
  tags?: Maybe<Array<Maybe<ProjectTag>>>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type IssueComment = {
  __typename?: 'IssueComment';
  comment: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issueId: Scalars['String']['output'];
  reporter: User;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type IssueStatus = {
  __typename?: 'IssueStatus';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type MessageAndStatus = {
  __typename?: 'MessageAndStatus';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignAssetAsAvatar?: Maybe<Asset>;
  createBoard?: Maybe<Board>;
  createIssue?: Maybe<Issue>;
  createIssueComment?: Maybe<IssueComment>;
  createIssueLink?: Maybe<MessageAndStatus>;
  createIssueStatus?: Maybe<IssueStatus>;
  createProject?: Maybe<Project>;
  createProjectTag?: Maybe<ProjectTag>;
  deleteAsset?: Maybe<MessageAndStatus>;
  deleteIssue?: Maybe<MessageAndStatus>;
  deleteIssueLink?: Maybe<MessageAndStatus>;
  deleteProjectTag?: Maybe<MessageAndStatus>;
  updateBoard?: Maybe<Board>;
  updateIssue?: Maybe<Issue>;
  updateMe?: Maybe<User>;
  uploadAsset?: Maybe<Asset>;
};


export type MutationAssignAssetAsAvatarArgs = {
  input: AssignAssetAsAvatarInput;
};


export type MutationCreateBoardArgs = {
  input?: InputMaybe<CreateBoardInput>;
};


export type MutationCreateIssueArgs = {
  input?: InputMaybe<CreateIssueInput>;
};


export type MutationCreateIssueCommentArgs = {
  input: CreateIssueCommentInput;
};


export type MutationCreateIssueLinkArgs = {
  input: CreateIssueLinkInput;
};


export type MutationCreateIssueStatusArgs = {
  input: CreateIssueStatusInput;
};


export type MutationCreateProjectArgs = {
  input?: InputMaybe<CreateProjectInput>;
};


export type MutationCreateProjectTagArgs = {
  input: CreateProjectTagInput;
};


export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};


export type MutationDeleteIssueArgs = {
  input: DeleteIssueInput;
};


export type MutationDeleteIssueLinkArgs = {
  input: DeleteIssueLinkInput;
};


export type MutationDeleteProjectTagArgs = {
  input: DeleteProjectTagInput;
};


export type MutationUpdateBoardArgs = {
  input?: InputMaybe<UpdateBoardInput>;
};


export type MutationUpdateIssueArgs = {
  input?: InputMaybe<UpdateIssueInput>;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUploadAssetArgs = {
  input: UploadAssetInput;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Project = {
  __typename?: 'Project';
  boards?: Maybe<Array<Maybe<Board>>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  imageId?: Maybe<Scalars['Int']['output']>;
  issueCount?: Maybe<Scalars['Int']['output']>;
  issueStatuses?: Maybe<Array<Maybe<IssueStatus>>>;
  issues?: Maybe<Array<Maybe<Issue>>>;
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<ProjectTag>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<ProjectVisibility>;
};


export type ProjectIssuesArgs = {
  input?: InputMaybe<QueryIssueInput>;
};

export type ProjectTag = {
  __typename?: 'ProjectTag';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export enum ProjectVisibility {
  Internal = 'INTERNAL',
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Query = {
  __typename?: 'Query';
  board?: Maybe<Board>;
  boards?: Maybe<Array<Maybe<Board>>>;
  createProjectValidation?: Maybe<MessageAndStatus>;
  helloWorld: Scalars['String']['output'];
  issue?: Maybe<Issue>;
  issues?: Maybe<Array<Maybe<Issue>>>;
  me?: Maybe<User>;
  project?: Maybe<Project>;
  projectTags?: Maybe<Array<Maybe<ProjectTag>>>;
  projects?: Maybe<Array<Maybe<Project>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryBoardArgs = {
  input: QueryBoardInput;
};


export type QueryCreateProjectValidationArgs = {
  input: CreateProjectValidationInput;
};


export type QueryIssueArgs = {
  input?: InputMaybe<QueryIssueInput>;
};


export type QueryIssuesArgs = {
  input?: InputMaybe<QueryIssueInput>;
};


export type QueryProjectArgs = {
  input?: InputMaybe<QueryProjectInput>;
};


export type QueryProjectTagsArgs = {
  input: QueryProjectTagsInput;
};


export type QueryProjectsArgs = {
  input?: InputMaybe<QueryProjectInput>;
};

export type QueryBoardInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type QueryIssueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<InputMaybe<SortBy>>>;
};

export type QueryProjectInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type QueryProjectTagsInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['String']['input'];
};

export type SortBy = {
  field: Scalars['String']['input'];
  order: Order;
};

export type UpdateBoardInput = {
  backlogEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  containerOrder?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<Scalars['String']['input']>;
  viewState?: InputMaybe<Array<InputMaybe<ViewStateInput>>>;
};

export type UpdateIssueInput = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  issueStatusId?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  reporterId?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UploadAssetInput = {
  assetExtension: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type ViewState = {
  __typename?: 'ViewState';
  id: Scalars['ID']['output'];
  items?: Maybe<Array<Maybe<ViewStateItem>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ViewStateInput = {
  id: Scalars['ID']['input'];
  items?: InputMaybe<Array<InputMaybe<ViewStateItemInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ViewStateIssueStatus = {
  __typename?: 'ViewStateIssueStatus';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
};

export type ViewStateIssueStatusInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
};

export type ViewStateItem = {
  __typename?: 'ViewStateItem';
  id: Scalars['ID']['output'];
  status?: Maybe<ViewStateIssueStatus>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ViewStateItemInput = {
  id: Scalars['ID']['input'];
  status?: InputMaybe<ViewStateIssueStatusInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIssueStatusFragment = { __typename?: 'Issue', id: string, status?: { __typename?: 'IssueStatus', id: string, name: string } | null } & { ' $fragmentName'?: 'UpdateIssueStatusFragment' };

export type ProjectFieldsFragment = { __typename?: 'Project', id?: string | null, name?: string | null, key?: string | null, description?: string | null, visibility?: ProjectVisibility | null, createdAt?: string | null, updatedAt?: string | null, boards?: Array<{ __typename?: 'Board', id?: string | null, name?: string | null, backlogEnabled?: boolean | null, settings?: string | null, createdAt?: string | null, updatedAt?: string | null, viewState?: Array<(
      { __typename?: 'ViewState' }
      & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
    ) | null> | null } | null> | null, issueStatuses?: Array<{ __typename?: 'IssueStatus', id: string, name: string, projectId?: string | null, createdAt?: string | null, updatedAt?: string | null } | null> | null, issues?: Array<(
    { __typename?: 'Issue' }
    & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'ProjectFieldsFragment' };

export type ProjectOnlyFieldsFragment = { __typename?: 'Project', id?: string | null, name?: string | null, key?: string | null, visibility?: ProjectVisibility | null, description?: string | null, createdAt?: string | null, updatedAt?: string | null } & { ' $fragmentName'?: 'ProjectOnlyFieldsFragment' };

export type IssueFieldsFragment = { __typename?: 'Issue', id: string, title: string, description?: string | null, projectId?: string | null, priority?: number | null, archived?: boolean | null, createdAt?: string | null, updatedAt?: string | null, tags?: Array<{ __typename?: 'ProjectTag', id: string, name: string, projectId: string, createdAt?: string | null, updatedAt?: string | null } | null> | null, status?: { __typename?: 'IssueStatus', id: string, name: string, projectId?: string | null } | null, reporter?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) | null, assignee?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) | null, comments?: Array<(
    { __typename?: 'IssueComment' }
    & { ' $fragmentRefs'?: { 'IssueCommentFieldsFragment': IssueCommentFieldsFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'IssueFieldsFragment' };

export type UserFieldsFragment = { __typename?: 'User', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, avatarUrl?: string | null } & { ' $fragmentName'?: 'UserFieldsFragment' };

export type IssueCommentFieldsFragment = { __typename?: 'IssueComment', id: string, comment: string, issueId: string, createdAt?: string | null, updatedAt?: string | null, reporter: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) } & { ' $fragmentName'?: 'IssueCommentFieldsFragment' };

export type ViewStateIssueStatusFieldsFragment = { __typename?: 'ViewStateIssueStatus', id: string, name?: string | null, projectId?: string | null } & { ' $fragmentName'?: 'ViewStateIssueStatusFieldsFragment' };

export type ViewStateItemFieldsFragment = { __typename?: 'ViewStateItem', id: string, title?: string | null, status?: (
    { __typename?: 'ViewStateIssueStatus' }
    & { ' $fragmentRefs'?: { 'ViewStateIssueStatusFieldsFragment': ViewStateIssueStatusFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'ViewStateItemFieldsFragment' };

export type ViewStateFieldsFragment = { __typename?: 'ViewState', id: string, title?: string | null, items?: Array<(
    { __typename?: 'ViewStateItem' }
    & { ' $fragmentRefs'?: { 'ViewStateItemFieldsFragment': ViewStateItemFieldsFragment } }
  ) | null> | null } & { ' $fragmentName'?: 'ViewStateFieldsFragment' };

export type GetIssueQueryVariables = Exact<{
  input?: InputMaybe<QueryIssueInput>;
}>;


export type GetIssueQuery = { __typename?: 'Query', issue?: (
    { __typename?: 'Issue', links?: Array<(
      { __typename?: 'Issue', linkType?: string | null, linkedIssueId?: string | null }
      & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
    ) | null> | null }
    & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
  ) | null };

export type GetIssuesQueryVariables = Exact<{
  input?: InputMaybe<QueryIssueInput>;
}>;


export type GetIssuesQuery = { __typename?: 'Query', issues?: Array<(
    { __typename?: 'Issue', project?: (
      { __typename?: 'Project' }
      & { ' $fragmentRefs'?: { 'ProjectOnlyFieldsFragment': ProjectOnlyFieldsFragment } }
    ) | null, links?: Array<(
      { __typename?: 'Issue', linkType?: string | null, linkedIssueId?: string | null }
      & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
    ) | null> | null }
    & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
  ) | null> | null };

export type GetProjectInfoQueryVariables = Exact<{
  input?: InputMaybe<QueryProjectInput>;
  issueInput?: InputMaybe<QueryIssueInput>;
}>;


export type GetProjectInfoQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id?: string | null, name?: string | null, key?: string | null, description?: string | null, boards?: Array<{ __typename?: 'Board', id?: string | null, backlogEnabled?: boolean | null, containerOrder?: string | null, viewState?: Array<(
        { __typename?: 'ViewState' }
        & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
      ) | null> | null } | null> | null, issueStatuses?: Array<{ __typename?: 'IssueStatus', id: string, projectId?: string | null, name: string, createdAt?: string | null } | null> | null, issues?: Array<(
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
    ) | null> | null } | null };

export type CreateIssueMutationVariables = Exact<{
  input?: InputMaybe<CreateIssueInput>;
}>;


export type CreateIssueMutation = { __typename?: 'Mutation', createIssue?: (
    { __typename?: 'Issue' }
    & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
  ) | null };

export type CreateIssueCommentMutationVariables = Exact<{
  input: CreateIssueCommentInput;
}>;


export type CreateIssueCommentMutation = { __typename?: 'Mutation', createIssueComment?: (
    { __typename?: 'IssueComment' }
    & { ' $fragmentRefs'?: { 'IssueCommentFieldsFragment': IssueCommentFieldsFragment } }
  ) | null };

export type GetIssueStatusesQueryVariables = Exact<{
  input?: InputMaybe<QueryProjectInput>;
}>;


export type GetIssueStatusesQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id?: string | null, name?: string | null, description?: string | null, issueStatuses?: Array<{ __typename?: 'IssueStatus', id: string, projectId?: string | null, name: string, createdAt?: string | null } | null> | null } | null };

export type UpdateIssueMutationVariables = Exact<{
  input?: InputMaybe<UpdateIssueInput>;
}>;


export type UpdateIssueMutation = { __typename?: 'Mutation', updateIssue?: (
    { __typename?: 'Issue' }
    & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
  ) | null };

export type DeleteIssueMutationVariables = Exact<{
  input: DeleteIssueInput;
}>;


export type DeleteIssueMutation = { __typename?: 'Mutation', deleteIssue?: { __typename?: 'MessageAndStatus', message?: string | null, status?: string | null } | null };

export type CreateProjectValidationQueryVariables = Exact<{
  input: CreateProjectValidationInput;
}>;


export type CreateProjectValidationQuery = { __typename?: 'Query', createProjectValidation?: { __typename?: 'MessageAndStatus', status?: string | null, message?: string | null } | null };

export type UploadAssetMutationVariables = Exact<{
  input: UploadAssetInput;
}>;


export type UploadAssetMutation = { __typename?: 'Mutation', uploadAsset?: { __typename?: 'Asset', id: string, assetPath?: string | null } | null };

export type AssignAssetAsAvatarMutationVariables = Exact<{
  input: AssignAssetAsAvatarInput;
}>;


export type AssignAssetAsAvatarMutation = { __typename?: 'Mutation', assignAssetAsAvatar?: { __typename?: 'Asset', id: string } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users?: Array<(
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) | null> | null };

export type CreateIssueStatusMutationVariables = Exact<{
  input: CreateIssueStatusInput;
}>;


export type CreateIssueStatusMutation = { __typename?: 'Mutation', createIssueStatus?: { __typename?: 'IssueStatus', id: string, name: string, projectId?: string | null, createdAt?: string | null } | null };

export type CreateProjectMutationVariables = Exact<{
  input?: InputMaybe<CreateProjectInput>;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: (
    { __typename?: 'Project', boards?: Array<{ __typename?: 'Board', id?: string | null, style?: string | null, backlogEnabled?: boolean | null, createdAt?: string | null, viewState?: Array<(
        { __typename?: 'ViewState' }
        & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
      ) | null> | null } | null> | null }
    & { ' $fragmentRefs'?: { 'ProjectOnlyFieldsFragment': ProjectOnlyFieldsFragment } }
  ) | null };

export type GetProjectsQueryVariables = Exact<{
  input?: InputMaybe<QueryProjectInput>;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects?: Array<(
    { __typename?: 'Project', boards?: Array<{ __typename?: 'Board', id?: string | null, style?: string | null, backlogEnabled?: boolean | null, viewState?: Array<(
        { __typename?: 'ViewState' }
        & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
      ) | null> | null } | null> | null }
    & { ' $fragmentRefs'?: { 'ProjectOnlyFieldsFragment': ProjectOnlyFieldsFragment } }
  ) | null> | null };

export type UpdateBoardMutationVariables = Exact<{
  input?: InputMaybe<UpdateBoardInput>;
}>;


export type UpdateBoardMutation = { __typename?: 'Mutation', updateBoard?: { __typename?: 'Board', id?: string | null, name?: string | null, backlogEnabled?: boolean | null, settings?: string | null, viewState?: Array<(
      { __typename?: 'ViewState' }
      & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
    ) | null> | null } | null };

export type GetProjectTagsQueryVariables = Exact<{
  input: QueryProjectTagsInput;
}>;


export type GetProjectTagsQuery = { __typename?: 'Query', projectTags?: Array<{ __typename?: 'ProjectTag', id: string, name: string, projectId: string, createdAt?: string | null, updatedAt?: string | null } | null> | null };

export type CreateProjectTagMutationVariables = Exact<{
  input: CreateProjectTagInput;
}>;


export type CreateProjectTagMutation = { __typename?: 'Mutation', createProjectTag?: { __typename?: 'ProjectTag', id: string, name: string } | null };

export type DeleteProjectTagMutationVariables = Exact<{
  input: DeleteProjectTagInput;
}>;


export type DeleteProjectTagMutation = { __typename?: 'Mutation', deleteProjectTag?: { __typename?: 'MessageAndStatus', message?: string | null, status?: string | null } | null };

export type GetBoardInfoQueryVariables = Exact<{
  input: QueryBoardInput;
}>;


export type GetBoardInfoQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id?: string | null, name?: string | null, backlogEnabled?: boolean | null, settings?: string | null, containerOrder?: string | null, viewState?: Array<(
      { __typename?: 'ViewState' }
      & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
    ) | null> | null } | null };

export type GetBoardIssuesQueryVariables = Exact<{
  input: QueryBoardInput;
}>;


export type GetBoardIssuesQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id?: string | null, name?: string | null, backlogEnabled?: boolean | null, settings?: string | null, containerOrder?: string | null, viewState?: Array<(
      { __typename?: 'ViewState' }
      & { ' $fragmentRefs'?: { 'ViewStateFieldsFragment': ViewStateFieldsFragment } }
    ) | null> | null, issues?: Array<(
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueFieldsFragment': IssueFieldsFragment } }
    ) | null> | null } | null };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateMeInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) | null };

export type CreateIssueLinkMutationVariables = Exact<{
  input: CreateIssueLinkInput;
}>;


export type CreateIssueLinkMutation = { __typename?: 'Mutation', createIssueLink?: { __typename?: 'MessageAndStatus', message?: string | null, status?: string | null } | null };

export type DeleteIssueLinkMutationVariables = Exact<{
  input: DeleteIssueLinkInput;
}>;


export type DeleteIssueLinkMutation = { __typename?: 'Mutation', deleteIssueLink?: { __typename?: 'MessageAndStatus', message?: string | null, status?: string | null } | null };

export const UpdateIssueStatusFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateIssueStatus"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateIssueStatusFragment, unknown>;
export const ViewStateIssueStatusFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]} as unknown as DocumentNode<ViewStateIssueStatusFieldsFragment, unknown>;
export const ViewStateItemFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]} as unknown as DocumentNode<ViewStateItemFieldsFragment, unknown>;
export const ViewStateFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}}]} as unknown as DocumentNode<ViewStateFieldsFragment, unknown>;
export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const IssueCommentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<IssueCommentFieldsFragment, unknown>;
export const IssueFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<IssueFieldsFragment, unknown>;
export const ProjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProjectFieldsFragment, unknown>;
export const ProjectOnlyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectOnlyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProjectOnlyFieldsFragment, unknown>;
export const GetIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryIssueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}},{"kind":"Field","name":{"kind":"Name","value":"linkType"}},{"kind":"Field","name":{"kind":"Name","value":"linkedIssueId"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetIssueQuery, GetIssueQueryVariables>;
export const GetIssuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryIssueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectOnlyFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}},{"kind":"Field","name":{"kind":"Name","value":"linkType"}},{"kind":"Field","name":{"kind":"Name","value":"linkedIssueId"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectOnlyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetIssuesQuery, GetIssuesQueryVariables>;
export const GetProjectInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryProjectInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issueInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryIssueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"containerOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetProjectInfoQuery, GetProjectInfoQueryVariables>;
export const CreateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateIssueMutation, CreateIssueMutationVariables>;
export const CreateIssueCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssueComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssueComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateIssueCommentMutation, CreateIssueCommentMutationVariables>;
export const GetIssueStatusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssueStatuses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryProjectInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"issueStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetIssueStatusesQuery, GetIssueStatusesQueryVariables>;
export const UpdateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIssueInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateIssueMutation, UpdateIssueMutationVariables>;
export const DeleteIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueMutation, DeleteIssueMutationVariables>;
export const CreateProjectValidationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateProjectValidation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectValidationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProjectValidation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateProjectValidationQuery, CreateProjectValidationQueryVariables>;
export const UploadAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetPath"}}]}}]}}]} as unknown as DocumentNode<UploadAssetMutation, UploadAssetMutationVariables>;
export const AssignAssetAsAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignAssetAsAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignAssetAsAvatarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignAssetAsAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AssignAssetAsAvatarMutation, AssignAssetAsAvatarMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const CreateIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateIssueStatusMutation, CreateIssueStatusMutationVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectOnlyFields"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"style"}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectOnlyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const GetProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryProjectInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectOnlyFields"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"style"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectOnlyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}}]} as unknown as DocumentNode<GetProjectsQuery, GetProjectsQueryVariables>;
export const UpdateBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBoardInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}}]} as unknown as DocumentNode<UpdateBoardMutation, UpdateBoardMutationVariables>;
export const GetProjectTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryProjectTagsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectTagsQuery, GetProjectTagsQueryVariables>;
export const CreateProjectTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProjectTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProjectTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateProjectTagMutation, CreateProjectTagMutationVariables>;
export const DeleteProjectTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProjectTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteProjectTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProjectTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteProjectTagMutation, DeleteProjectTagMutationVariables>;
export const GetBoardInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"containerOrder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}}]} as unknown as DocumentNode<GetBoardInfoQuery, GetBoardInfoQueryVariables>;
export const GetBoardIssuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardIssues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QueryBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"viewState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backlogEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"containerOrder"}},{"kind":"Field","name":{"kind":"Name","value":"issues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateIssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateIssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewStateItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateIssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueComment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ViewStateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ViewState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ViewStateItemFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reporter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCommentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetBoardIssuesQuery, GetBoardIssuesQueryVariables>;
export const UpdateMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>;
export const CreateIssueLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssueLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssueLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateIssueLinkMutation, CreateIssueLinkMutationVariables>;
export const DeleteIssueLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssueLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssueLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueLinkMutation, DeleteIssueLinkMutationVariables>;