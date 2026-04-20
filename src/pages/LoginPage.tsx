import LoginForm from '../components/sections/LoginForm';
import LoginHeroPanel from '../components/sections/LoginHeroPanel';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginHeroPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </div>
  );
}
