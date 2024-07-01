'use client';

import { useForm } from 'react-hook-form';
import { Icons } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  Form
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const createClubSchema = z.object({
  name: z
    .string({
      required_error: 'Club name is required'
    })
    .min(4, 'Club name must be at least 4 characters')
});

type CreateClubSchema = z.infer<typeof createClubSchema>;

export const CreateClubForm = () => {
  const form = useForm<CreateClubSchema>({
    resolver: zodResolver(createClubSchema)
  });
  const router = useRouter();

  const onSubmit = async (data: CreateClubSchema) => {
    const createClubPromise = api.post('/clubs', data);

    toast.promise(createClubPromise, {
      loading: 'Creating club...',
      success: () => {
        router.push('/dashboard');
        router.refresh();

        return 'Club created successfully';
      },
      error: (error) => {
        console.error(error);
        return 'An error occurred while creating the club';
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Club name"
                  autoCapitalize="none"
                  autoComplete="name"
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
          Create club
        </Button>
      </form>
    </Form>
  );
};
