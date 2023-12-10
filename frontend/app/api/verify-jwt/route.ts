import { getToken } from 'next-auth/jwt';

export async function GET(request: Request) {
  // @ts-ignore
  const token = await getToken({ req: request });

  if (!token) {
    return Response.json({ message: 'Auth required' }, { status: 401 });
  }

  if (token.name && !token.given_name) {
    token.given_name = token.name.split(' ')[0];
  }

  if (token.name && !token.family_name) {
    token.family_name = token.name.split(' ')[1];
  }

  return Response.json(token);
}
