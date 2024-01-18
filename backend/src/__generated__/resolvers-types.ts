import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';

import type { ApolloContext } from '../server/apollo.js';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type AddItemToViewStateItemInput = {
  boardId: Scalars['String']['input'];
  columnPositionIndex?: InputMaybe<Scalars['Int']['input']>;
  issueId: Scalars['String']['input'];
  viewStateId: Scalars['String']['input'];
};

export type AddUserToProjectInput = {
  projectId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Asset = {
  __typename?: 'Asset';
  assetPath?: Maybe<Scalars['String']['output']>;
  assetSubType?: Maybe<Scalars['String']['output']>;
  assetType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  ownerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AssignAssetAsAvatarInput = {
  assetId: Scalars['String']['input'];
};

export type Board = {
  __typename?: 'Board';
  backlogEnabled?: Maybe<Scalars['Boolean']['output']>;
  columns?: Maybe<Array<Maybe<Column>>>;
  containerOrder?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  issues?: Maybe<Array<Maybe<Issue>>>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
  viewState?: Maybe<Array<Maybe<ViewState>>>;
};

export enum BoardStyle {
  Kanban = 'KANBAN',
  Scrum = 'SCRUM',
}

export enum Custom_Field_Type {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT',
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
  commentRaw?: InputMaybe<Scalars['String']['input']>;
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

export type CreateProjectCustomFieldInput = {
  fieldName: Scalars['String']['input'];
  fieldType: Custom_Field_Type;
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

export type CreateViewStateInput = {
  boardId: Scalars['String']['input'];
  positionIndex?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CustomField = {
  __typename?: 'CustomField';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fieldName: Scalars['String']['output'];
  fieldType: Custom_Field_Type;
  id: Scalars['ID']['output'];
  projectId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CustomFieldValue = {
  __typename?: 'CustomFieldValue';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customField?: Maybe<CustomField>;
  customFieldId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['String']['output'];
};

export type DeleteAssetInput = {
  assetId: Scalars['String']['input'];
};

export type DeleteIssueCommentInput = {
  commentId: Scalars['String']['input'];
};

export type DeleteIssueInput = {
  id: Scalars['String']['input'];
};

export type DeleteIssueLinkInput = {
  issueId: Scalars['String']['input'];
  linkType: Scalars['String']['input'];
  linkedIssueId: Scalars['String']['input'];
};

export type DeleteProjectCustomFieldInput = {
  id: Scalars['String']['input'];
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
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customFields?: Maybe<Array<Maybe<CustomFieldValue>>>;
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
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IssueComment = {
  __typename?: 'IssueComment';
  comment: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  issueId: Scalars['String']['output'];
  reporter: User;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IssueStatus = {
  __typename?: 'IssueStatus';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageAndStatus = {
  __typename?: 'MessageAndStatus';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addItemToViewState?: Maybe<Array<Maybe<ViewState>>>;
  addUserToProject?: Maybe<MessageAndStatus>;
  assignAssetAsAvatar?: Maybe<Asset>;
  createBoard?: Maybe<Board>;
  createIssue?: Maybe<Issue>;
  createIssueComment?: Maybe<IssueComment>;
  createIssueLink?: Maybe<MessageAndStatus>;
  createIssueStatus?: Maybe<IssueStatus>;
  createProject?: Maybe<Project>;
  createProjectCustomField?: Maybe<CustomField>;
  createProjectTag?: Maybe<ProjectTag>;
  createViewState?: Maybe<Array<Maybe<ViewState>>>;
  deleteAsset?: Maybe<MessageAndStatus>;
  deleteIssue?: Maybe<MessageAndStatus>;
  deleteIssueComment?: Maybe<MessageAndStatus>;
  deleteIssueLink?: Maybe<MessageAndStatus>;
  deleteProjectCustomField?: Maybe<MessageAndStatus>;
  deleteProjectTag?: Maybe<MessageAndStatus>;
  removeItemFromViewState?: Maybe<Array<Maybe<ViewState>>>;
  removeUserFromProject?: Maybe<MessageAndStatus>;
  updateBoard?: Maybe<Board>;
  updateIssue?: Maybe<Issue>;
  updateIssueComment?: Maybe<IssueComment>;
  updateMe?: Maybe<User>;
  updateViewState?: Maybe<Array<Maybe<ViewState>>>;
  uploadAsset?: Maybe<Asset>;
};

export type MutationAddItemToViewStateArgs = {
  input: AddItemToViewStateItemInput;
};

export type MutationAddUserToProjectArgs = {
  input: AddUserToProjectInput;
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

export type MutationCreateProjectCustomFieldArgs = {
  input: CreateProjectCustomFieldInput;
};

export type MutationCreateProjectTagArgs = {
  input: CreateProjectTagInput;
};

export type MutationCreateViewStateArgs = {
  input: CreateViewStateInput;
};

export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};

export type MutationDeleteIssueArgs = {
  input: DeleteIssueInput;
};

export type MutationDeleteIssueCommentArgs = {
  input: DeleteIssueCommentInput;
};

export type MutationDeleteIssueLinkArgs = {
  input: DeleteIssueLinkInput;
};

export type MutationDeleteProjectCustomFieldArgs = {
  input: DeleteProjectCustomFieldInput;
};

export type MutationDeleteProjectTagArgs = {
  input: DeleteProjectTagInput;
};

export type MutationRemoveItemFromViewStateArgs = {
  input: RemoveItemFromViewStateItemInput;
};

export type MutationRemoveUserFromProjectArgs = {
  input: RemoveUserFromProjectInput;
};

export type MutationUpdateBoardArgs = {
  input?: InputMaybe<UpdateBoardInput>;
};

export type MutationUpdateIssueArgs = {
  input?: InputMaybe<UpdateIssueInput>;
};

export type MutationUpdateIssueCommentArgs = {
  input: UpdateIssueCommentInput;
};

export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};

export type MutationUpdateViewStateArgs = {
  input: UpdateViewStateInput;
};

export type MutationUploadAssetArgs = {
  input: UploadAssetInput;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Project = {
  __typename?: 'Project';
  boards?: Maybe<Array<Maybe<Board>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customFields?: Maybe<Array<Maybe<CustomField>>>;
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
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<Array<Maybe<User>>>;
  visibility?: Maybe<ProjectVisibility>;
};

export type ProjectIssuesArgs = {
  input?: InputMaybe<QueryIssueInput>;
};

export type ProjectTag = {
  __typename?: 'ProjectTag';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ProjectVisibility {
  Internal = 'INTERNAL',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
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

export type RemoveItemFromViewStateItemInput = {
  id: Scalars['ID']['input'];
  viewStateId: Scalars['String']['input'];
};

export type RemoveUserFromProjectInput = {
  projectId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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

export type UpdateIssueCommentInput = {
  comment: Scalars['String']['input'];
  commentId: Scalars['String']['input'];
};

export type UpdateIssueInput = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  customFieldId?: InputMaybe<Scalars['String']['input']>;
  customFieldValue?: InputMaybe<Scalars['String']['input']>;
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
  settings?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateViewStateInput = {
  id: Scalars['ID']['input'];
  positionIndex?: InputMaybe<Scalars['Int']['input']>;
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
  name?: Maybe<Scalars['String']['output']>;
  settings?: Maybe<Scalars['String']['output']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddItemToViewStateItemInput: ResolverTypeWrapper<Partial<AddItemToViewStateItemInput>>;
  AddUserToProjectInput: ResolverTypeWrapper<Partial<AddUserToProjectInput>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AssignAssetAsAvatarInput: ResolverTypeWrapper<Partial<AssignAssetAsAvatarInput>>;
  Board: ResolverTypeWrapper<Partial<Board>>;
  BoardStyle: ResolverTypeWrapper<Partial<BoardStyle>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  CUSTOM_FIELD_TYPE: ResolverTypeWrapper<Partial<Custom_Field_Type>>;
  Column: ResolverTypeWrapper<Partial<Column>>;
  CreateBoardInput: ResolverTypeWrapper<Partial<CreateBoardInput>>;
  CreateIssueCommentInput: ResolverTypeWrapper<Partial<CreateIssueCommentInput>>;
  CreateIssueInput: ResolverTypeWrapper<Partial<CreateIssueInput>>;
  CreateIssueLinkInput: ResolverTypeWrapper<Partial<CreateIssueLinkInput>>;
  CreateIssueStatusInput: ResolverTypeWrapper<Partial<CreateIssueStatusInput>>;
  CreateProjectCustomFieldInput: ResolverTypeWrapper<Partial<CreateProjectCustomFieldInput>>;
  CreateProjectInput: ResolverTypeWrapper<Partial<CreateProjectInput>>;
  CreateProjectTagInput: ResolverTypeWrapper<Partial<CreateProjectTagInput>>;
  CreateProjectValidationInput: ResolverTypeWrapper<Partial<CreateProjectValidationInput>>;
  CreateViewStateInput: ResolverTypeWrapper<Partial<CreateViewStateInput>>;
  CustomField: ResolverTypeWrapper<Partial<CustomField>>;
  CustomFieldValue: ResolverTypeWrapper<Partial<CustomFieldValue>>;
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']['output']>>;
  DeleteAssetInput: ResolverTypeWrapper<Partial<DeleteAssetInput>>;
  DeleteIssueCommentInput: ResolverTypeWrapper<Partial<DeleteIssueCommentInput>>;
  DeleteIssueInput: ResolverTypeWrapper<Partial<DeleteIssueInput>>;
  DeleteIssueLinkInput: ResolverTypeWrapper<Partial<DeleteIssueLinkInput>>;
  DeleteProjectCustomFieldInput: ResolverTypeWrapper<Partial<DeleteProjectCustomFieldInput>>;
  DeleteProjectTagInput: ResolverTypeWrapper<Partial<DeleteProjectTagInput>>;
  File: ResolverTypeWrapper<Partial<File>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Issue: ResolverTypeWrapper<Partial<Issue>>;
  IssueComment: ResolverTypeWrapper<Partial<IssueComment>>;
  IssueStatus: ResolverTypeWrapper<Partial<IssueStatus>>;
  MessageAndStatus: ResolverTypeWrapper<Partial<MessageAndStatus>>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Partial<Order>>;
  Project: ResolverTypeWrapper<Partial<Project>>;
  ProjectTag: ResolverTypeWrapper<Partial<ProjectTag>>;
  ProjectVisibility: ResolverTypeWrapper<Partial<ProjectVisibility>>;
  Query: ResolverTypeWrapper<{}>;
  QueryBoardInput: ResolverTypeWrapper<Partial<QueryBoardInput>>;
  QueryIssueInput: ResolverTypeWrapper<Partial<QueryIssueInput>>;
  QueryProjectInput: ResolverTypeWrapper<Partial<QueryProjectInput>>;
  QueryProjectTagsInput: ResolverTypeWrapper<Partial<QueryProjectTagsInput>>;
  RemoveItemFromViewStateItemInput: ResolverTypeWrapper<Partial<RemoveItemFromViewStateItemInput>>;
  RemoveUserFromProjectInput: ResolverTypeWrapper<Partial<RemoveUserFromProjectInput>>;
  SortBy: ResolverTypeWrapper<Partial<SortBy>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  UpdateBoardInput: ResolverTypeWrapper<Partial<UpdateBoardInput>>;
  UpdateIssueCommentInput: ResolverTypeWrapper<Partial<UpdateIssueCommentInput>>;
  UpdateIssueInput: ResolverTypeWrapper<Partial<UpdateIssueInput>>;
  UpdateMeInput: ResolverTypeWrapper<Partial<UpdateMeInput>>;
  UpdateViewStateInput: ResolverTypeWrapper<Partial<UpdateViewStateInput>>;
  Upload: ResolverTypeWrapper<Partial<Scalars['Upload']['output']>>;
  UploadAssetInput: ResolverTypeWrapper<Partial<UploadAssetInput>>;
  User: ResolverTypeWrapper<Partial<User>>;
  ViewState: ResolverTypeWrapper<Partial<ViewState>>;
  ViewStateInput: ResolverTypeWrapper<Partial<ViewStateInput>>;
  ViewStateIssueStatus: ResolverTypeWrapper<Partial<ViewStateIssueStatus>>;
  ViewStateIssueStatusInput: ResolverTypeWrapper<Partial<ViewStateIssueStatusInput>>;
  ViewStateItem: ResolverTypeWrapper<Partial<ViewStateItem>>;
  ViewStateItemInput: ResolverTypeWrapper<Partial<ViewStateItemInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddItemToViewStateItemInput: Partial<AddItemToViewStateItemInput>;
  AddUserToProjectInput: Partial<AddUserToProjectInput>;
  Asset: Partial<Asset>;
  AssignAssetAsAvatarInput: Partial<AssignAssetAsAvatarInput>;
  Board: Partial<Board>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Column: Partial<Column>;
  CreateBoardInput: Partial<CreateBoardInput>;
  CreateIssueCommentInput: Partial<CreateIssueCommentInput>;
  CreateIssueInput: Partial<CreateIssueInput>;
  CreateIssueLinkInput: Partial<CreateIssueLinkInput>;
  CreateIssueStatusInput: Partial<CreateIssueStatusInput>;
  CreateProjectCustomFieldInput: Partial<CreateProjectCustomFieldInput>;
  CreateProjectInput: Partial<CreateProjectInput>;
  CreateProjectTagInput: Partial<CreateProjectTagInput>;
  CreateProjectValidationInput: Partial<CreateProjectValidationInput>;
  CreateViewStateInput: Partial<CreateViewStateInput>;
  CustomField: Partial<CustomField>;
  CustomFieldValue: Partial<CustomFieldValue>;
  DateTime: Partial<Scalars['DateTime']['output']>;
  DeleteAssetInput: Partial<DeleteAssetInput>;
  DeleteIssueCommentInput: Partial<DeleteIssueCommentInput>;
  DeleteIssueInput: Partial<DeleteIssueInput>;
  DeleteIssueLinkInput: Partial<DeleteIssueLinkInput>;
  DeleteProjectCustomFieldInput: Partial<DeleteProjectCustomFieldInput>;
  DeleteProjectTagInput: Partial<DeleteProjectTagInput>;
  File: Partial<File>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  Issue: Partial<Issue>;
  IssueComment: Partial<IssueComment>;
  IssueStatus: Partial<IssueStatus>;
  MessageAndStatus: Partial<MessageAndStatus>;
  Mutation: {};
  Project: Partial<Project>;
  ProjectTag: Partial<ProjectTag>;
  Query: {};
  QueryBoardInput: Partial<QueryBoardInput>;
  QueryIssueInput: Partial<QueryIssueInput>;
  QueryProjectInput: Partial<QueryProjectInput>;
  QueryProjectTagsInput: Partial<QueryProjectTagsInput>;
  RemoveItemFromViewStateItemInput: Partial<RemoveItemFromViewStateItemInput>;
  RemoveUserFromProjectInput: Partial<RemoveUserFromProjectInput>;
  SortBy: Partial<SortBy>;
  String: Partial<Scalars['String']['output']>;
  UpdateBoardInput: Partial<UpdateBoardInput>;
  UpdateIssueCommentInput: Partial<UpdateIssueCommentInput>;
  UpdateIssueInput: Partial<UpdateIssueInput>;
  UpdateMeInput: Partial<UpdateMeInput>;
  UpdateViewStateInput: Partial<UpdateViewStateInput>;
  Upload: Partial<Scalars['Upload']['output']>;
  UploadAssetInput: Partial<UploadAssetInput>;
  User: Partial<User>;
  ViewState: Partial<ViewState>;
  ViewStateInput: Partial<ViewStateInput>;
  ViewStateIssueStatus: Partial<ViewStateIssueStatus>;
  ViewStateIssueStatusInput: Partial<ViewStateIssueStatusInput>;
  ViewStateItem: Partial<ViewStateItem>;
  ViewStateItemInput: Partial<ViewStateItemInput>;
}>;

export type AssetResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['Asset']> = ResolversObject<{
  assetPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assetSubType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assetType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BoardResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['Board']> = ResolversObject<{
  backlogEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  columns?: Resolver<Maybe<Array<Maybe<ResolversTypes['Column']>>>, ParentType, ContextType>;
  containerOrder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['Issue']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  style?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  viewState?: Resolver<Maybe<Array<Maybe<ResolversTypes['ViewState']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ColumnResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['Column'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['Issue']>>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomFieldResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['CustomField'],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldType?: Resolver<ResolversTypes['CUSTOM_FIELD_TYPE'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomFieldValueResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['CustomFieldValue'],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  customField?: Resolver<Maybe<ResolversTypes['CustomField']>, ParentType, ContextType>;
  customFieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FileResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['File']> = ResolversObject<{
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IssueResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['Issue']> = ResolversObject<{
  archived?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  assignee?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['IssueComment']>>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  customFields?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomFieldValue']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  linkType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedIssueId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  links?: Resolver<Maybe<Array<Maybe<ResolversTypes['Issue']>>>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reporter?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['IssueStatus']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectTag']>>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IssueCommentResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['IssueComment'],
> = ResolversObject<{
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reporter?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IssueStatusResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['IssueStatus'],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageAndStatusResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['MessageAndStatus'],
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  addItemToViewState?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ViewState']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationAddItemToViewStateArgs, 'input'>
  >;
  addUserToProject?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationAddUserToProjectArgs, 'input'>
  >;
  assignAssetAsAvatar?: Resolver<
    Maybe<ResolversTypes['Asset']>,
    ParentType,
    ContextType,
    RequireFields<MutationAssignAssetAsAvatarArgs, 'input'>
  >;
  createBoard?: Resolver<Maybe<ResolversTypes['Board']>, ParentType, ContextType, Partial<MutationCreateBoardArgs>>;
  createIssue?: Resolver<Maybe<ResolversTypes['Issue']>, ParentType, ContextType, Partial<MutationCreateIssueArgs>>;
  createIssueComment?: Resolver<
    Maybe<ResolversTypes['IssueComment']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateIssueCommentArgs, 'input'>
  >;
  createIssueLink?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateIssueLinkArgs, 'input'>
  >;
  createIssueStatus?: Resolver<
    Maybe<ResolversTypes['IssueStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateIssueStatusArgs, 'input'>
  >;
  createProject?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    Partial<MutationCreateProjectArgs>
  >;
  createProjectCustomField?: Resolver<
    Maybe<ResolversTypes['CustomField']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateProjectCustomFieldArgs, 'input'>
  >;
  createProjectTag?: Resolver<
    Maybe<ResolversTypes['ProjectTag']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateProjectTagArgs, 'input'>
  >;
  createViewState?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ViewState']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateViewStateArgs, 'input'>
  >;
  deleteAsset?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteAssetArgs, 'input'>
  >;
  deleteIssue?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteIssueArgs, 'input'>
  >;
  deleteIssueComment?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteIssueCommentArgs, 'input'>
  >;
  deleteIssueLink?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteIssueLinkArgs, 'input'>
  >;
  deleteProjectCustomField?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteProjectCustomFieldArgs, 'input'>
  >;
  deleteProjectTag?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteProjectTagArgs, 'input'>
  >;
  removeItemFromViewState?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ViewState']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveItemFromViewStateArgs, 'input'>
  >;
  removeUserFromProject?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveUserFromProjectArgs, 'input'>
  >;
  updateBoard?: Resolver<Maybe<ResolversTypes['Board']>, ParentType, ContextType, Partial<MutationUpdateBoardArgs>>;
  updateIssue?: Resolver<Maybe<ResolversTypes['Issue']>, ParentType, ContextType, Partial<MutationUpdateIssueArgs>>;
  updateIssueComment?: Resolver<
    Maybe<ResolversTypes['IssueComment']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateIssueCommentArgs, 'input'>
  >;
  updateMe?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMeArgs, 'input'>
  >;
  updateViewState?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ViewState']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateViewStateArgs, 'input'>
  >;
  uploadAsset?: Resolver<
    Maybe<ResolversTypes['Asset']>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadAssetArgs, 'input'>
  >;
}>;

export type ProjectResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['Project'],
> = ResolversObject<{
  boards?: Resolver<Maybe<Array<Maybe<ResolversTypes['Board']>>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  customFields?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomField']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  imageId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  issueCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  issueStatuses?: Resolver<Maybe<Array<Maybe<ResolversTypes['IssueStatus']>>>, ParentType, ContextType>;
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['Issue']>>>, ParentType, ContextType, Partial<ProjectIssuesArgs>>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectTag']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  visibility?: Resolver<Maybe<ResolversTypes['ProjectVisibility']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectTagResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['ProjectTag'],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['Query']> = ResolversObject<{
  board?: Resolver<Maybe<ResolversTypes['Board']>, ParentType, ContextType, RequireFields<QueryBoardArgs, 'input'>>;
  boards?: Resolver<Maybe<Array<Maybe<ResolversTypes['Board']>>>, ParentType, ContextType>;
  createProjectValidation?: Resolver<
    Maybe<ResolversTypes['MessageAndStatus']>,
    ParentType,
    ContextType,
    RequireFields<QueryCreateProjectValidationArgs, 'input'>
  >;
  helloWorld?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issue?: Resolver<Maybe<ResolversTypes['Issue']>, ParentType, ContextType, Partial<QueryIssueArgs>>;
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['Issue']>>>, ParentType, ContextType, Partial<QueryIssuesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, Partial<QueryProjectArgs>>;
  projectTags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ProjectTag']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryProjectTagsArgs, 'input'>
  >;
  projects?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Project']>>>,
    ParentType,
    ContextType,
    Partial<QueryProjectsArgs>
  >;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = ApolloContext, ParentType = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ViewStateResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['ViewState'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['ViewStateItem']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ViewStateIssueStatusResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['ViewStateIssueStatus'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ViewStateItemResolvers<
  ContextType = ApolloContext,
  ParentType = ResolversParentTypes['ViewStateItem'],
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ViewStateIssueStatus']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  Asset?: AssetResolvers<ContextType>;
  Board?: BoardResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  CustomField?: CustomFieldResolvers<ContextType>;
  CustomFieldValue?: CustomFieldValueResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  File?: FileResolvers<ContextType>;
  Issue?: IssueResolvers<ContextType>;
  IssueComment?: IssueCommentResolvers<ContextType>;
  IssueStatus?: IssueStatusResolvers<ContextType>;
  MessageAndStatus?: MessageAndStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectTag?: ProjectTagResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  ViewState?: ViewStateResolvers<ContextType>;
  ViewStateIssueStatus?: ViewStateIssueStatusResolvers<ContextType>;
  ViewStateItem?: ViewStateItemResolvers<ContextType>;
}>;
