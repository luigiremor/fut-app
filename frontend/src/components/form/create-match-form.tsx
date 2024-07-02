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
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { TimePicker } from '../ui/time-picker/time-picker';
import { useRouter } from 'next/navigation';
import { CreateMatchDto, Match } from '@/types/Api';
import { AxiosResponse } from 'axios';

const createMatchSchema = z.object({
  date: z.date({
    required_error: 'Match date is required'
  }),
  location: z
    .string({
      required_error: 'Match location is required'
    })
    .min(4, 'Match location must be at least 4 characters')
});

type CreateMatchSchema = z.infer<typeof createMatchSchema>;

const createMatch = ({
  createMatchDto
}: {
  createMatchDto: CreateMatchDto;
}) => {
  return api.post('/matches', createMatchDto);
};

export const CreateMatchForm = ({ clubName }: { clubName: string }) => {
  const form = useForm<CreateMatchSchema>({
    resolver: zodResolver(createMatchSchema)
  });

  const router = useRouter();

  const onSubmit = async (data: CreateMatchSchema) => {
    const createMatchPromise: Promise<AxiosResponse<Match>> = createMatch({
      createMatchDto: {
        date: data.date.toDateString(),
        location: data.location,
        clubName
      }
    });

    toast.promise(createMatchPromise, {
      loading: 'Creating Match...',
      success: (res) => {
        console.log(res.data.id);

        router.push(`/club/${clubName}/match/${res.data.id}`);

        return 'Match created successfully';
      },
      error: (error) => {
        console.error(error);
        return 'An error occurred while creating the Match';
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Location"
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
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Date</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP HH:mm:ss')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
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
          Create Match
        </Button>
      </form>
    </Form>
  );
};
