import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '@/utils/supabase';

export const Route = createFileRoute('/general/sign-up')({
  component: SignUp,
});

function SignUp() {
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email: '', password: '' });

    if (error) {
      alert(error.message);
      console.error('Supabase sign-up error:', error);
    }
  };
  return <button onClick={handleSignUp}>Sign Up</button>;
}
