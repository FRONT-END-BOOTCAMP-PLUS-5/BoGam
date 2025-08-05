import LoginForm from '../components/auth/LoginForm';

export default function TestLoginPage() {
  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='container mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          NextAuth 로그인 테스트
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
