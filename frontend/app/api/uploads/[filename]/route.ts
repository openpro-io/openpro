import { getToken } from 'next-auth/jwt';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  console.log('filename:', filename);
  // @ts-ignore
  const token = await getToken({ req: request });
  const httpsOrHttp = request.headers.get('x-forwarded-proto') ?? 'http';

  if (!token) {
    return Response.json({ message: 'Auth required' }, { status: 401 });
  }

  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/${filename}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'stream',
    }
  );

  return new Response(resp.data);
}
