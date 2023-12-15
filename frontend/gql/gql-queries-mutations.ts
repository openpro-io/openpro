import { gql } from '@apollo/client';

export const PROJECT_FIELDS = gql(/* GraphQL */ `
  fragment ProjectFields on Project {
    id
    name
    key
    description
    createdAt
    updatedAt
    boards {
      id
      name
      viewState {
        ...ViewStateFields
      }
      backlogEnabled
      settings
      createdAt
      updatedAt
    }
    issueStatuses {
      id
      name
      projectId
      createdAt
      updatedAt
    }
    issues {
      ...IssueFields
    }
  }
`);

export const ISSUE_FIELDS = gql(/* GraphQL */ `
  fragment IssueFields on Issue {
    id
    title
    description
    projectId
    priority
    tags {
      id
      name
      projectId
      createdAt
      updatedAt
    }
    status {
      id
      name
      projectId
    }
    reporter {
      ...UserFields
    }
    assignee {
      ...UserFields
    }
    comments {
      ...IssueCommentFields
    }
    createdAt
    updatedAt
  }
`);

export const USER_FIELDS = gql(/* GraphQL */ `
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    avatarUrl
  }
`);

export const ISSUE_COMMENT_FIELDS = gql(/* GraphQL */ `
  fragment IssueCommentFields on IssueComment {
    id
    comment
    reporter {
      ...UserFields
    }
    issueId
    createdAt
    updatedAt
  }
`);

export const VIEW_STATE_ISSUE_STATUS_FIELDS = gql(/* GraphQL */ `
  fragment ViewStateIssueStatusFields on ViewStateIssueStatus {
    id
    name
    projectId
  }
`);

export const VIEW_STATE_ITEM_FIELDS = gql(/* GraphQL */ `
  fragment ViewStateItemFields on ViewStateItem {
    id
    title
    status {
      ...ViewStateIssueStatusFields
    }
  }
`);

export const VIEW_STATE_FIELDS = gql(/* GraphQL */ `
  fragment ViewStateFields on ViewState {
    id
    title
    items {
      ...ViewStateItemFields
    }
  }
`);

export const GET_ISSUE_QUERY = gql(/* GraphQL */ `
  query GetIssue($input: QueryIssueInput) {
    issue(input: $input) {
      ...IssueFields
    }
  }
`);

export const GET_PROJECT_INFO = gql(/* GraphQL */ `
  query GetProjectInfo(
    $input: QueryProjectInput
    $issueInput: QueryIssueInput
  ) {
    project(input: $input) {
      id
      name
      key
      description
      boards {
        id
        viewState {
          ...ViewStateFields
        }
        backlogEnabled
        containerOrder
      }
      issueStatuses {
        id
        projectId
        name
        createdAt
      }
      issues(input: $issueInput) {
        ...IssueFields
      }
    }
  }
`);

export const CREATE_ISSUE_MUTATION = gql(/* GraphQL */ `
  mutation CreateIssue($input: CreateIssueInput) {
    createIssue(input: $input) {
      ...IssueFields
    }
  }
`);

export const CREATE_ISSUE_COMMENT_MUTATION = gql(/* GraphQL */ `
  mutation CreateIssueComment($input: CreateIssueCommentInput!) {
    createIssueComment(input: $input) {
      ...IssueCommentFields
    }
  }
`);

export const GET_ISSUE_STATUSES_FOR_PROJECT = gql(/* GraphQL */ `
  query GetIssueStatuses($input: QueryProjectInput) {
    project(input: $input) {
      id
      name
      description
      issueStatuses {
        id
        projectId
        name
        createdAt
      }
    }
  }
`);

export const UPDATE_ISSUE_MUTATION = gql(/* GraphQL */ `
  mutation UpdateIssue($input: UpdateIssueInput) {
    updateIssue(input: $input) {
      ...IssueFields
    }
  }
`);

export const DELETE_ISSUE_MUTATION = gql(/* GraphQL */ `
  mutation DeleteIssue($input: DeleteIssueInput!) {
    deleteIssue(input: $input) {
      message
      status
    }
  }
`);

export const CREATE_PROJECT_VALIDATION_QUERY = gql(/* GraphQL */ `
  query CreateProjectValidation($input: CreateProjectValidationInput!) {
    createProjectValidation(input: $input) {
      status
      message
    }
  }
`);

export const UPLOAD_ASSET_MUTATION = gql(/* GraphQL */ `
  mutation UploadAsset($input: UploadAssetInput!) {
    uploadAsset(input: $input) {
      id
      assetPath
    }
  }
`);

export const ASSIGN_ASSET_AS_AVATAR_MUTATION = gql(/* GraphQL */ `
  mutation AssignAssetAsAvatar($input: AssignAssetAsAvatarInput!) {
    assignAssetAsAvatar(input: $input) {
      id
    }
  }
`);

export const GET_ME = gql(/* GraphQL */ `
  query GetMe {
    me {
      ...UserFields
    }
  }
`);

export const GET_USERS = gql(/* GraphQL */ `
  query GetUsers {
    users {
      ...UserFields
    }
  }
`);

export const CREATE_ISSUE_STATUS_MUTATION = gql(/* GraphQL */ `
  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {
    createIssueStatus(input: $input) {
      id
      name
      projectId
      createdAt
    }
  }
`);

export const CREATE_PROJECT_MUTATION = gql(/* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput) {
    createProject(input: $input) {
      id
      name
      description
      boards {
        id
        style
        backlogEnabled
        viewState {
          ...ViewStateFields
        }
        createdAt
      }
    }
  }
`);

export const GET_PROJECTS = gql(/* GraphQL */ `
  query GetProjects($input: QueryProjectInput) {
    projects(input: $input) {
      id
      name
      key
      createdAt
      issueCount
      boards {
        id
        style
        viewState {
          ...ViewStateFields
        }
        backlogEnabled
      }
    }
  }
`);

export const UPDATE_BOARD_MUTATION = gql(/* GraphQL */ `
  mutation UpdateBoard($input: UpdateBoardInput) {
    updateBoard(input: $input) {
      id
      name
      viewState {
        ...ViewStateFields
      }
      backlogEnabled
      settings
    }
  }
`);

export const GET_PROJECT_TAGS = gql(/* GraphQL */ `
  query GetProjectTags($input: QueryProjectTagsInput!) {
    projectTags(input: $input) {
      id
      name
      projectId
      createdAt
      updatedAt
    }
  }
`);

export const CREATE_PROJECT_TAG_MUTATION = gql(/* GraphQL */ `
  mutation CreateProjectTag($input: CreateProjectTagInput!) {
    createProjectTag(input: $input) {
      id
      name
    }
  }
`);

export const DELETE_PROJECT_TAG_MUTATION = gql(/* GraphQL */ `
  mutation DeleteProjectTag($input: DeleteProjectTagInput!) {
    deleteProjectTag(input: $input) {
      message
      status
    }
  }
`);

export const GET_BOARD_INFO = gql(/* GraphQL */ `
  query GetBoardInfo($input: QueryBoardInput!) {
    board(input: $input) {
      id
      name
      viewState {
        ...ViewStateFields
      }
      backlogEnabled
      settings
      containerOrder
    }
  }
`);

export const GET_BOARD_ISSUES = gql(/* GraphQL */ `
  query GetBoardIssues($input: QueryBoardInput!) {
    board(input: $input) {
      id
      name
      viewState {
        ...ViewStateFields
      }
      backlogEnabled
      settings
      containerOrder
      issues {
        ...IssueFields
      }
    }
  }
`);

export const UPDATE_ME = gql(/* GraphQL */ `
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      ...UserFields
    }
  }
`);
