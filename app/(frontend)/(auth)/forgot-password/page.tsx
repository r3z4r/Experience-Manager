import ForgotPasswordForm from '@/app/(frontend)/_components/auth/ForgotPasswordForm';
import AuthFormLayout from '@/app/(frontend)/_components/auth/AuthFormLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthFormLayout 
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthFormLayout>
  );
}


