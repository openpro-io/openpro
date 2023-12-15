/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n                fragment UpdateIssueStatus on Issue {\n                  id\n                  status {\n                    id\n                    name\n                  }\n                }\n              ": types.UpdateIssueStatusFragmentDoc,
    "\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    createdAt\n    updatedAt\n    boards {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      createdAt\n      updatedAt\n    }\n    issueStatuses {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    issues {\n      ...IssueFields\n    }\n  }\n": types.ProjectFieldsFragmentDoc,
    "\n  fragment IssueFields on Issue {\n    id\n    title\n    description\n    projectId\n    priority\n    tags {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    status {\n      id\n      name\n      projectId\n    }\n    reporter {\n      ...UserFields\n    }\n    assignee {\n      ...UserFields\n    }\n    comments {\n      ...IssueCommentFields\n    }\n    createdAt\n    updatedAt\n  }\n": types.IssueFieldsFragmentDoc,
    "\n  fragment UserFields on User {\n    id\n    email\n    firstName\n    lastName\n    avatarUrl\n  }\n": types.UserFieldsFragmentDoc,
    "\n  fragment IssueCommentFields on IssueComment {\n    id\n    comment\n    reporter {\n      ...UserFields\n    }\n    issueId\n    createdAt\n    updatedAt\n  }\n": types.IssueCommentFieldsFragmentDoc,
    "\n  fragment ViewStateIssueStatusFields on ViewStateIssueStatus {\n    id\n    name\n    projectId\n  }\n": types.ViewStateIssueStatusFieldsFragmentDoc,
    "\n  fragment ViewStateItemFields on ViewStateItem {\n    id\n    title\n    status {\n      ...ViewStateIssueStatusFields\n    }\n  }\n": types.ViewStateItemFieldsFragmentDoc,
    "\n  fragment ViewStateFields on ViewState {\n    id\n    title\n    items {\n      ...ViewStateItemFields\n    }\n  }\n": types.ViewStateFieldsFragmentDoc,
    "\n  query GetIssue($input: QueryIssueInput) {\n    issue(input: $input) {\n      ...IssueFields\n    }\n  }\n": types.GetIssueDocument,
    "\n  query GetProjectInfo(\n    $input: QueryProjectInput\n    $issueInput: QueryIssueInput\n  ) {\n    project(input: $input) {\n      id\n      name\n      key\n      description\n      boards {\n        id\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n        containerOrder\n      }\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n      issues(input: $issueInput) {\n        ...IssueFields\n      }\n    }\n  }\n": types.GetProjectInfoDocument,
    "\n  mutation CreateIssue($input: CreateIssueInput) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n": types.CreateIssueDocument,
    "\n  mutation CreateIssueComment($input: CreateIssueCommentInput!) {\n    createIssueComment(input: $input) {\n      ...IssueCommentFields\n    }\n  }\n": types.CreateIssueCommentDocument,
    "\n  query GetIssueStatuses($input: QueryProjectInput) {\n    project(input: $input) {\n      id\n      name\n      description\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n    }\n  }\n": types.GetIssueStatusesDocument,
    "\n  mutation UpdateIssue($input: UpdateIssueInput) {\n    updateIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n": types.UpdateIssueDocument,
    "\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      message\n      status\n    }\n  }\n": types.DeleteIssueDocument,
    "\n  query CreateProjectValidation($input: CreateProjectValidationInput!) {\n    createProjectValidation(input: $input) {\n      status\n      message\n    }\n  }\n": types.CreateProjectValidationDocument,
    "\n  mutation UploadAsset($input: UploadAssetInput!) {\n    uploadAsset(input: $input) {\n      id\n      assetPath\n    }\n  }\n": types.UploadAssetDocument,
    "\n  mutation AssignAssetAsAvatar($input: AssignAssetAsAvatarInput!) {\n    assignAssetAsAvatar(input: $input) {\n      id\n    }\n  }\n": types.AssignAssetAsAvatarDocument,
    "\n  query GetMe {\n    me {\n      ...UserFields\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetUsers {\n    users {\n      ...UserFields\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n    }\n  }\n": types.CreateIssueStatusDocument,
    "\n  mutation CreateProject($input: CreateProjectInput) {\n    createProject(input: $input) {\n      id\n      name\n      description\n      boards {\n        id\n        style\n        backlogEnabled\n        viewState {\n          ...ViewStateFields\n        }\n        createdAt\n      }\n    }\n  }\n": types.CreateProjectDocument,
    "\n  query GetProjects($input: QueryProjectInput) {\n    projects(input: $input) {\n      id\n      name\n      key\n      createdAt\n      issueCount\n      boards {\n        id\n        style\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n      }\n    }\n  }\n": types.GetProjectsDocument,
    "\n  mutation UpdateBoard($input: UpdateBoardInput) {\n    updateBoard(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n    }\n  }\n": types.UpdateBoardDocument,
    "\n  query GetProjectTags($input: QueryProjectTagsInput!) {\n    projectTags(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetProjectTagsDocument,
    "\n  mutation CreateProjectTag($input: CreateProjectTagInput!) {\n    createProjectTag(input: $input) {\n      id\n      name\n    }\n  }\n": types.CreateProjectTagDocument,
    "\n  mutation DeleteProjectTag($input: DeleteProjectTagInput!) {\n    deleteProjectTag(input: $input) {\n      message\n      status\n    }\n  }\n": types.DeleteProjectTagDocument,
    "\n  query GetBoardInfo($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n    }\n  }\n": types.GetBoardInfoDocument,
    "\n  query GetBoardIssues($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n      issues {\n        ...IssueFields\n      }\n    }\n  }\n": types.GetBoardIssuesDocument,
    "\n  mutation UpdateMe($input: UpdateMeInput!) {\n    updateMe(input: $input) {\n      ...UserFields\n    }\n  }\n": types.UpdateMeDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n                fragment UpdateIssueStatus on Issue {\n                  id\n                  status {\n                    id\n                    name\n                  }\n                }\n              "): (typeof documents)["\n                fragment UpdateIssueStatus on Issue {\n                  id\n                  status {\n                    id\n                    name\n                  }\n                }\n              "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    createdAt\n    updatedAt\n    boards {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      createdAt\n      updatedAt\n    }\n    issueStatuses {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    issues {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    createdAt\n    updatedAt\n    boards {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      createdAt\n      updatedAt\n    }\n    issueStatuses {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    issues {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueFields on Issue {\n    id\n    title\n    description\n    projectId\n    priority\n    tags {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    status {\n      id\n      name\n      projectId\n    }\n    reporter {\n      ...UserFields\n    }\n    assignee {\n      ...UserFields\n    }\n    comments {\n      ...IssueCommentFields\n    }\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment IssueFields on Issue {\n    id\n    title\n    description\n    projectId\n    priority\n    tags {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n    status {\n      id\n      name\n      projectId\n    }\n    reporter {\n      ...UserFields\n    }\n    assignee {\n      ...UserFields\n    }\n    comments {\n      ...IssueCommentFields\n    }\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserFields on User {\n    id\n    email\n    firstName\n    lastName\n    avatarUrl\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    email\n    firstName\n    lastName\n    avatarUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment IssueCommentFields on IssueComment {\n    id\n    comment\n    reporter {\n      ...UserFields\n    }\n    issueId\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment IssueCommentFields on IssueComment {\n    id\n    comment\n    reporter {\n      ...UserFields\n    }\n    issueId\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ViewStateIssueStatusFields on ViewStateIssueStatus {\n    id\n    name\n    projectId\n  }\n"): (typeof documents)["\n  fragment ViewStateIssueStatusFields on ViewStateIssueStatus {\n    id\n    name\n    projectId\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ViewStateItemFields on ViewStateItem {\n    id\n    title\n    status {\n      ...ViewStateIssueStatusFields\n    }\n  }\n"): (typeof documents)["\n  fragment ViewStateItemFields on ViewStateItem {\n    id\n    title\n    status {\n      ...ViewStateIssueStatusFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ViewStateFields on ViewState {\n    id\n    title\n    items {\n      ...ViewStateItemFields\n    }\n  }\n"): (typeof documents)["\n  fragment ViewStateFields on ViewState {\n    id\n    title\n    items {\n      ...ViewStateItemFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssue($input: QueryIssueInput) {\n    issue(input: $input) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  query GetIssue($input: QueryIssueInput) {\n    issue(input: $input) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectInfo(\n    $input: QueryProjectInput\n    $issueInput: QueryIssueInput\n  ) {\n    project(input: $input) {\n      id\n      name\n      key\n      description\n      boards {\n        id\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n        containerOrder\n      }\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n      issues(input: $issueInput) {\n        ...IssueFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjectInfo(\n    $input: QueryProjectInput\n    $issueInput: QueryIssueInput\n  ) {\n    project(input: $input) {\n      id\n      name\n      key\n      description\n      boards {\n        id\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n        containerOrder\n      }\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n      issues(input: $issueInput) {\n        ...IssueFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssue($input: CreateIssueInput) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssue($input: CreateIssueInput) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssueComment($input: CreateIssueCommentInput!) {\n    createIssueComment(input: $input) {\n      ...IssueCommentFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssueComment($input: CreateIssueCommentInput!) {\n    createIssueComment(input: $input) {\n      ...IssueCommentFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIssueStatuses($input: QueryProjectInput) {\n    project(input: $input) {\n      id\n      name\n      description\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetIssueStatuses($input: QueryProjectInput) {\n    project(input: $input) {\n      id\n      name\n      description\n      issueStatuses {\n        id\n        projectId\n        name\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateIssue($input: UpdateIssueInput) {\n    updateIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIssue($input: UpdateIssueInput) {\n    updateIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      message\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      message\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CreateProjectValidation($input: CreateProjectValidationInput!) {\n    createProjectValidation(input: $input) {\n      status\n      message\n    }\n  }\n"): (typeof documents)["\n  query CreateProjectValidation($input: CreateProjectValidationInput!) {\n    createProjectValidation(input: $input) {\n      status\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UploadAsset($input: UploadAssetInput!) {\n    uploadAsset(input: $input) {\n      id\n      assetPath\n    }\n  }\n"): (typeof documents)["\n  mutation UploadAsset($input: UploadAssetInput!) {\n    uploadAsset(input: $input) {\n      id\n      assetPath\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AssignAssetAsAvatar($input: AssignAssetAsAvatarInput!) {\n    assignAssetAsAvatar(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation AssignAssetAsAvatar($input: AssignAssetAsAvatarInput!) {\n    assignAssetAsAvatar(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsers {\n    users {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {\n    createIssueStatus(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProject($input: CreateProjectInput) {\n    createProject(input: $input) {\n      id\n      name\n      description\n      boards {\n        id\n        style\n        backlogEnabled\n        viewState {\n          ...ViewStateFields\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject($input: CreateProjectInput) {\n    createProject(input: $input) {\n      id\n      name\n      description\n      boards {\n        id\n        style\n        backlogEnabled\n        viewState {\n          ...ViewStateFields\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjects($input: QueryProjectInput) {\n    projects(input: $input) {\n      id\n      name\n      key\n      createdAt\n      issueCount\n      boards {\n        id\n        style\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjects($input: QueryProjectInput) {\n    projects(input: $input) {\n      id\n      name\n      key\n      createdAt\n      issueCount\n      boards {\n        id\n        style\n        viewState {\n          ...ViewStateFields\n        }\n        backlogEnabled\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateBoard($input: UpdateBoardInput) {\n    updateBoard(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBoard($input: UpdateBoardInput) {\n    updateBoard(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectTags($input: QueryProjectTagsInput!) {\n    projectTags(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetProjectTags($input: QueryProjectTagsInput!) {\n    projectTags(input: $input) {\n      id\n      name\n      projectId\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProjectTag($input: CreateProjectTagInput!) {\n    createProjectTag(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProjectTag($input: CreateProjectTagInput!) {\n    createProjectTag(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteProjectTag($input: DeleteProjectTagInput!) {\n    deleteProjectTag(input: $input) {\n      message\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProjectTag($input: DeleteProjectTagInput!) {\n    deleteProjectTag(input: $input) {\n      message\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBoardInfo($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n    }\n  }\n"): (typeof documents)["\n  query GetBoardInfo($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBoardIssues($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n      issues {\n        ...IssueFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBoardIssues($input: QueryBoardInput!) {\n    board(input: $input) {\n      id\n      name\n      viewState {\n        ...ViewStateFields\n      }\n      backlogEnabled\n      settings\n      containerOrder\n      issues {\n        ...IssueFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMe($input: UpdateMeInput!) {\n    updateMe(input: $input) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMe($input: UpdateMeInput!) {\n    updateMe(input: $input) {\n      ...UserFields\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;