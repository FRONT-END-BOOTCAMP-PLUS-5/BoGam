import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/authOptions';

export default async function SessionDebugPage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <h1>🪪 Session Token Debugger</h1>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p>세션 토큰을 찾을 수 없습니다.</p>
      )}
    </main>
  );
}
