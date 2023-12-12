import { getToken } from 'next-auth/jwt';

export async function GET(request: Request) {
  // @ts-ignore
  const token = await getToken({ req: request, raw: true });

  if (!token) {
    return Response.json({ message: 'Auth required' }, { status: 401 });
  }

  return Response.json({ token });
}
