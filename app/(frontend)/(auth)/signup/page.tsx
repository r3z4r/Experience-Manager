import AuthBranding from '@/app/(frontend)/_components/auth/AuthBranding';
import SignUpForm from '@/app/(frontend)/_components/auth/SignUpForm';
import AuthFormLayout from '@/app/(frontend)/_components/auth/AuthFormLayout';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthBranding />
      <div className="flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-[#2242A4] to-[#1B3E8A] p-8 md:p-16">
        <AuthFormLayout 
          title="Create Your Account"
          subtitle="Join us to start managing your experiences."
        >
          <SignUpForm />
        </AuthFormLayout>
      </div>
    </div>
  );
}

