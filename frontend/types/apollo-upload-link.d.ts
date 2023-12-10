import type { ApolloLink } from '@apollo/client';
import type { RequestInit } from 'node-fetch';

type ExtractableFileMatcher<T = any> = (value: unknown) => value is T;

type FormDataFileAppender<T = any> = (
  formData: FormData,
  fieldName: string,
  file: T
) => void;

interface CreateUploadLinkOptions {
  uri?: string;
  useGETForQueries?: boolean;
  isExtractableFile?: ExtractableFileMatcher;
  FormData?: typeof FormData;
  formDataAppendFile?: FormDataFileAppender;
  print?: (ast: any) => string;
  fetch?: typeof fetch;
  fetchOptions?: RequestInit;
  credentials?: string;
  headers?: { [headerName: string]: string };
  includeExtensions?: boolean;
}

declare module 'apollo-upload-client/createUploadLink.mjs' {
  const createUploadLink: (options?: CreateUploadLinkOptions) => ApolloLink;
  export default createUploadLink;
}
