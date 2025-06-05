import SignInForm from '@/app/(frontend)/_components/auth/SignInForm';
import AuthFormLayout from '@/app/(frontend)/_components/auth/AuthFormLayout';

export default function LoginPage() {
  return (
    <AuthFormLayout 
      title="Welcome Back!"
      subtitle="Sign in to continue to your Experience Manager."
    >
      <SignInForm />
    </AuthFormLayout>
  );
}


