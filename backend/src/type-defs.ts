import gql from 'graphql-tag';

const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  scalar DateTime

  enum ProjectVisibility {
    PUBLIC
    INTERNAL
    PRIVATE
  }

  enum CUSTOM_FIELD_TYPE {
    TEXT
    NUMBER
    DATE
    BOOLEAN
  }

  enum Order {
    ASC
    DESC
  }

  input SortBy {
    field: String!
    order: Order!
  }

  # TYPES
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type MessageAndStatus {
    message: String
    status: String
  }

  type IssueComment {
    id: ID!
    issueId: String!
    comment: String!
    reporter: User!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type User {
    id: ID
    externalId: String
    firstName: String
    lastName: String
    name: String
    email: String
    avatarUrl: String
    settings: String
  }

  type ProjectTag {
    id: ID!
    name: String!
    projectId: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Project {
    id: ID
    name: String
    key: String
    description: String
    imageId: Int
    status: String
    visibility: ProjectVisibility
    createdAt: DateTime
    updatedAt: DateTime
    boards: [Board]
    issueStatuses: [IssueStatus]
    issues(input: QueryIssueInput): [Issue]
    tags: [ProjectTag]
    users: [User]
    issueCount: Int
    customFields: [CustomField]
  }

  type CustomField {
    id: ID!
    projectId: String!
    fieldName: String!
    fieldType: CUSTOM_FIELD_TYPE!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type CustomFieldValue {
    id: ID!
    customFieldId: String!
    customField: CustomField
    value: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Issue {
    id: ID!
    title: String!
    description: String
    projectId: String
    project: Project
    status: IssueStatus
    reporter: User
    assignee: User
    createdAt: DateTime
    updatedAt: DateTime
    priority: Int
    archived: Boolean
    comments: [IssueComment]
    tags: [ProjectTag]

    links: [Issue]
    linkType: String
    linkedIssueId: String

    customFields: [CustomFieldValue]
  }

  type Column {
    id: ID!
    title: String!
    issues: [Issue]
  }

  type ViewStateIssueStatus {
    id: ID!
    name: String
    projectId: String
  }

  type ViewStateItem {
    id: ID!
    title: String
    status: ViewStateIssueStatus
  }

  type ViewState {
    id: ID!
    items: [ViewStateItem]
    title: String
  }

  type Board {
    id: ID
    name: String
    projectId: String
    style: String
    status: String
    viewState: [ViewState]
    backlogEnabled: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    settings: String
    columns: [Column]
    issues: [Issue]
    containerOrder: String
  }

  type IssueStatus {
    id: ID!
    projectId: String
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Asset {
    id: ID!
    ownerId: String
    assetType: String
    assetSubType: String
    assetPath: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum BoardStyle {
    KANBAN
    SCRUM
  }

  # INPUTS
  input CreateProjectInput {
    name: String!
    key: String!
    description: String
    visibility: ProjectVisibility
    boardName: String!
    boardStyle: BoardStyle!
  }

  input CreateBoardInput {
    name: String
    projectId: String
    style: String
  }

  input QueryProjectInput {
    id: String
  }

  input QueryBoardInput {
    id: String
  }

  input QueryIssueInput {
    id: String
    projectId: String
    search: String
    searchOperator: String
    sortBy: [SortBy]
  }

  input CreateIssueInput {
    projectId: String!
    boardId: String
    issueStatusId: String
    assigneeId: String
    title: String!
    description: String
    priority: Int
  }

  input UpdateIssueInput {
    id: String!
    issueStatusId: String
    assigneeId: String
    reporterId: String
    title: String
    description: String
    priority: Int
    archived: Boolean
    tagIds: [String]

    # This represents the ID of the project custom field id
    customFieldId: String
    # We will transform this value based on the custom field type
    customFieldValue: String
  }

  input DeleteIssueInput {
    id: String!
  }

  input UploadAssetInput {
    assetExtension: String!
    file: Upload!
  }

  input DeleteAssetInput {
    assetId: String!
  }

  input AssignAssetAsAvatarInput {
    assetId: String!
  }

  input CreateProjectValidationInput {
    name: String
    key: String
  }

  input CreateIssueCommentInput {
    issueId: String!
    comment: String!
    commentRaw: String
  }

  input UpdateIssueCommentInput {
    commentId: String!
    comment: String!
  }

  input DeleteIssueCommentInput {
    commentId: String!
  }

  input CreateIssueStatusInput {
    projectId: String!
    name: String!
  }

  input ViewStateIssueStatusInput {
    id: ID!
    name: String
    projectId: String
  }

  input ViewStateItemInput {
    id: ID!
    title: String
    status: ViewStateIssueStatusInput
  }

  input ViewStateInput {
    id: ID!
    items: [ViewStateItemInput]
    title: String
  }

  input UpdateBoardInput {
    id: String!
    name: String
    viewState: [ViewStateInput]
    backlogEnabled: Boolean
    settings: String
    containerOrder: String
  }

  input QueryProjectTagsInput {
    projectId: String!
    id: String
    name: String
  }

  input CreateProjectTagInput {
    projectId: String!
    name: String!
  }

  input DeleteProjectTagInput {
    id: String!
  }

  input UpdateMeInput {
    firstName: String
    lastName: String
    settings: String
  }

  input CreateIssueLinkInput {
    issueId: String!
    linkType: String!
    linkedIssueId: String!
  }

  input DeleteIssueLinkInput {
    issueId: String!
    linkType: String!
    linkedIssueId: String!
  }

  input AddUserToProjectInput {
    userId: String!
    projectId: String!
  }

  input RemoveUserFromProjectInput {
    userId: String!
    projectId: String!
  }

  input CreateProjectCustomFieldInput {
    projectId: String!
    fieldName: String!
    fieldType: CUSTOM_FIELD_TYPE!
  }

  input DeleteProjectCustomFieldInput {
    id: String!
  }

  input AddItemToViewStateItemInput {
    boardId: String!
    viewStateId: String!
    issueId: String!
    columnPositionIndex: Int
  }

  input RemoveItemFromViewStateItemInput {
    id: ID!
    viewStateId: String!
  }

  input CreateViewStateInput {
    boardId: String!
    positionIndex: Int
    title: String
  }

  # Mutations
  type Mutation {
    createProject(input: CreateProjectInput): Project

    addUserToProject(input: AddUserToProjectInput!): MessageAndStatus
    removeUserFromProject(input: RemoveUserFromProjectInput!): MessageAndStatus

    createProjectTag(input: CreateProjectTagInput!): ProjectTag
    deleteProjectTag(input: DeleteProjectTagInput!): MessageAndStatus

    createProjectCustomField(input: CreateProjectCustomFieldInput!): CustomField
    deleteProjectCustomField(input: DeleteProjectCustomFieldInput!): MessageAndStatus

    createBoard(input: CreateBoardInput): Board
    updateBoard(input: UpdateBoardInput): Board

    createIssue(input: CreateIssueInput): Issue
    updateIssue(input: UpdateIssueInput): Issue
    deleteIssue(input: DeleteIssueInput!): MessageAndStatus

    createIssueStatus(input: CreateIssueStatusInput!): IssueStatus

    uploadAsset(input: UploadAssetInput!): Asset
    deleteAsset(input: DeleteAssetInput!): MessageAndStatus

    assignAssetAsAvatar(input: AssignAssetAsAvatarInput!): Asset

    createIssueComment(input: CreateIssueCommentInput!): IssueComment
    updateIssueComment(input: UpdateIssueCommentInput!): IssueComment
    deleteIssueComment(input: DeleteIssueCommentInput!): MessageAndStatus

    createIssueLink(input: CreateIssueLinkInput!): MessageAndStatus
    deleteIssueLink(input: DeleteIssueLinkInput!): MessageAndStatus

    updateMe(input: UpdateMeInput!): User

    # Adds a column to the kanban board
    createViewState(input: CreateViewStateInput!): [ViewState]
    addItemToViewState(input: AddItemToViewStateItemInput!): [ViewState]
    removeItemFromViewState(input: RemoveItemFromViewStateItemInput!): [ViewState]
  }

  # Queries
  type Query {
    helloWorld: String!
    users: [User]
    user: User
    me: User
    projects(input: QueryProjectInput): [Project]
    project(input: QueryProjectInput): Project
    projectTags(input: QueryProjectTagsInput!): [ProjectTag]
    createProjectValidation(input: CreateProjectValidationInput!): MessageAndStatus
    boards: [Board]
    board(input: QueryBoardInput!): Board
    issues(input: QueryIssueInput): [Issue]
    issue(input: QueryIssueInput): Issue
  }
`;

export default typeDefs;
