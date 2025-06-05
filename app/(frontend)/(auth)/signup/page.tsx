import SignUpForm from '@/app/(frontend)/_components/auth/SignUpForm';
import AuthFormLayout from '@/app/(frontend)/_components/auth/AuthFormLayout';

export default function SignUpPage() {
  return (
    <AuthFormLayout 
      title="Create Your Account"
      subtitle="Join us to start managing your experiences."
    >
      <SignUpForm />
    </AuthFormLayout>
  );
}


