'use client';

import { FilePen } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const EditResultButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleToggleEdit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has('edit')) {
      params.delete('edit');

      return router.push(pathname + '?' + params.toString());
    }

    params.set('edit', 'true');
    return router.push(pathname + '?' + params.toString());
  };

  return (
    <Button className="gap-2" variant="secondary" onClick={handleToggleEdit}>
      <FilePen className="size-5" />
      Edit results
    </Button>
  );
};
