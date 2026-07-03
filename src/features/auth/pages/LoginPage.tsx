import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { supabase } from '@/shared/services/supabase/client';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToast } from '@/shared/components/ui/Toast';
import { Github, Chrome } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (values: AuthFormValues) => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await login(values.email, values.password);
        if (error) throw error;
        toast('Welcome back!', 'success');
      } else {
        const { error } = await supabase.auth.signUp(values);
        if (error) throw error;
        toast('Account created! Please check your email.', 'success');
      }
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 font-fredoka">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white p-8 rounded-modal shadow-premium border border-border"
        data-testid="login-container"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-white rounded-full rotate-45 translate-y-[1.5px]" />
            <div className="w-6 h-0.5 bg-white rounded-full -rotate-45 -translate-y-[1.5px]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Premium Notes</h1>
          <p className="text-muted text-sm mt-1">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            placeholder="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            placeholder="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button className="w-full mt-2" isLoading={loading}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-divider" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-muted font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" className="w-full" onClick={() => handleOAuth('github')}>
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => handleOAuth('google')}>
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>
        </div>

        <p className="mt-8 text-center text-[13px] text-secondary-text font-playpen">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline font-fredoka"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
