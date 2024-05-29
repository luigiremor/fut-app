'use client';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/common/icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      // Registration logic
      console.log('Registering user...');
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        console.log('User registered');
      }, 3000);
    } else {
      // Login logic
      console.log('Logging in user...');
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        console.log('User logged in');
      }, 3000);
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isRegister ? 'Create an account' : 'Sign in to your account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRegister
            ? 'Enter your details below to create your account'
            : 'Enter your email and password to sign in'}
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isRegister ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsRegister(!isRegister)}
            disabled={isLoading}
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
