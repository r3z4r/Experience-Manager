import AuthBranding from '@/app/(frontend)/_components/auth/AuthBranding';
import ForgotPasswordForm from '@/app/(frontend)/_components/auth/ForgotPasswordForm';
import AuthFormLayout from '@/app/(frontend)/_components/auth/AuthFormLayout';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthBranding />
      <div className="flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-[#2242A4] to-[#1B3E8A] p-8 md:p-16">
        <AuthFormLayout 
          title="Forgot Password?"
          subtitle="Enter your email address and we'll send you a link to reset your password."
        >
          <ForgotPasswordForm />
        </AuthFormLayout>
      </div>
    </div>
  );
}

