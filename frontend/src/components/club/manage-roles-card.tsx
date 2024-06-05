'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants, Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const ManageRolesCard = () => {
  const pathname = usePathname();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Manage Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Assign Roles</h3>
            <p className="text-gray-500 mb-2">
              Assign roles to members within the club.
            </p>

            <Link
              className={cn(
                buttonVariants({
                  variant: 'outline'
                })
              )}
              href={pathname + '/admin'}
            >
              Assign Roles
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Invite Members</h3>
            <p className="text-gray-500 mb-2">
              Invite new members to join the club.
            </p>
            <Button variant="outline" className="mt-2">
              Invite Members
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
