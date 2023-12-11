import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { headers } from 'next/headers';

// TODO: handle introspection better

interface Headers {
  [key: string]: string | null;
}

export async function POST(request: Request) {
  const headersList = headers();

  // @ts-ignore
  const token = await getToken({ req: request, raw: true });

  const isIntrospection = headersList.get('x-graphql-introspection');

  if (!token && !isIntrospection) {
    return Response.json({ message: 'Auth required' }, { status: 401 });
  }

  const httpsOrHttp = request.headers.get('x-forwarded-proto') ?? 'http';
  const isJson = request.headers
    .get('content-type')
    ?.includes('application/json');

  const headersToProxy: Headers = {};

  for (const key of headersList.keys()) {
    headersToProxy[key] = headersList.get(key);
  }

  // Override bearer token...
  if (!isIntrospection) {
    headersToProxy['Authorization'] = `Bearer ${token}`;
  }

  const body = isJson ? await request.json() : await request.formData();

  try {
    const axiosResponse = await axios.post(
      `${httpsOrHttp}://backend:8080/graphql`,
      body,
      {
        headers: headersToProxy,
      }
    );

    // console.log(axiosResponse.data);
    // console.log(axiosResponse.headers);

    const responseHeaders = {
      vary: axiosResponse.headers['vary'],
      'keep-alive': axiosResponse.headers['keep-alive'],
      'access-control-allow-origin':
        axiosResponse.headers['access-control-allow-origin'],
      'access-control-allow-credentials':
        axiosResponse.headers['access-control-allow-credentials'],
      'access-control-expose-headers':
        axiosResponse.headers['access-control-expose-headers'],
      'cache-control': axiosResponse.headers['cache-control'],
      'content-type': 'application/json',
    };

    return Response.json(axiosResponse.data, {
      headers: responseHeaders,
    });
  } catch (error) {
    // console.error({ error });
    return Response.json(error);
  }
}
