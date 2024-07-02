'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/common/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { signIn } from 'next-auth/react';
import api from '@/services/api';

const schema = z.object({
  username: z
    .string({
      required_error: 'Username is required'
    })
    .min(1, 'Username is required'),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(5, 'Password must be at least 6 characters')
});

type AuthenticationSchema = z.infer<typeof schema>;

async function registerUser(data: AuthenticationSchema) {
  return await api.post('/auth/register', data);
}

async function loginUser({
  data,
  redirectTo
}: {
  data: AuthenticationSchema;
  redirectTo?: string;
}) {
  return signIn('credentials', {
    callbackUrl: redirectTo ?? '/dashboard',
    username: data.username,
    password: data.password
  });
}

export function UserAuthForm({ redirectTo }: { redirectTo?: string }) {
  const [isRegister, setIsRegister] = useState(false);

  const form = useForm<AuthenticationSchema>({
    resolver: zodResolver(schema)
  });

  async function onSubmit(data: AuthenticationSchema) {
    if (isRegister) {
      const registerPromise = registerUser(data);

      toast.promise(registerPromise, {
        loading: 'Creating account...',
        success: () => {
          loginUser({ data, redirectTo });
          return 'Account created successfully';
        },
        error: 'Failed to create account'
      });

      return;
    }

    const loginPromise = loginUser({ data, redirectTo });

    toast.promise(loginPromise, {
      loading: 'Signing in...',
      success: () => {
        return 'Signed in successfully';
      },
      error: 'Failed to sign in'
    });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isRegister ? 'Create an account' : 'Sign in to your account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRegister
            ? 'Enter your details below to create your account'
            : 'Enter your username and password to sign in'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRegister ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRegister(!isRegister)}
              disabled={form.formState.isSubmitting}
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
