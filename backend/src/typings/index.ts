import { FastifyRequest, RequestGenericInterface } from 'fastify';
import http from 'http';
import { Readable } from 'stream';

export interface IQuerystring {}

export interface IHeaders {
  connection?: string;
}

export interface IParams {
  file?: any;
}

export interface IReply {
  200?: { success: boolean };
  302?: { url: string };
  401?: { error: string };
  error?: string;
  Readable?: Readable;
  ReadableBase?: Readable;
}

export interface requestGeneric extends RequestGenericInterface {
  Querystring: IQuerystring;
  Headers: IHeaders;
  Reply: IReply;
  Params: IParams;
}

export interface customRequest extends http.IncomingMessage {
  isMultipart?: boolean;
}

export interface AuthenticatedUser {
  user: any;
}

export type CustomFastifyRequest = FastifyRequest<{
  Body: {
    query?: string;
    variables?: any;
  };
  Headers: {
    authorization?: string;
  };
}>;
