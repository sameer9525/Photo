
import { SignupForm } from '@/components/auth/SignupForm';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_NAME } from '@/config/constants';

export default function SignupPage() {
  return (
    <>
      <CardHeader className="text-center p-0 mb-6">
        <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
        <CardDescription>Join {APP_NAME} and start sharing.</CardDescription>
      </CardHeader>
      <SignupForm />
    </>
  );
}
