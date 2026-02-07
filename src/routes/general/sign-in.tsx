import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '@/utils/supabase';

export const Route = createFileRoute('/general/sign-in')({
  component: SignIn,
});

function SignIn() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: '',
      password: '',
    });

    if (error) {
      alert(error.message);
      console.error('Supabase sign-in error:', error);
    }
  };
  return <button onClick={handleSignIn}>Sign In</button>;
}
