'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants, Button } from '@/components/ui/button';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Lock, Clipboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { createClubInvite } from '@/resolver/club/create-club-invite';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const ManageRolesCard = ({
  hasAdminPermission
}: {
  hasAdminPermission: boolean;
}) => {
  const pathname = usePathname();
  const params = useParams<{ clubName: string }>();
  const [inviteLink, setInviteLink] = useState<{ inviteLink: string }>();
  const { clubName } = params;

  const decodedClubName = decodeURIComponent(clubName);

  const handleInviteMembers = async () => {
    const data = await createClubInvite({
      clubName: decodedClubName
    });

    console.log(data);

    return setInviteLink(data);
  };

  const handleCopyInviteLink = ({ inviteLink }: { inviteLink: string }) => {
    navigator.clipboard.writeText(inviteLink);

    toast.info('Invite link copied to clipboard');
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
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
            {!hasAdminPermission && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="mt-2 flex gap-2"
                      disabled
                    >
                      <Lock className="size-5" />
                      Invite Members
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    You need to be an admin to invite members.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {hasAdminPermission && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Invite members</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {!inviteLink && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Create your own invite link!</DialogTitle>
                        <DialogDescription>
                          Click the button below to create your own invite link.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button onClick={handleInviteMembers}>
                          Create link
                        </Button>
                      </DialogFooter>
                    </>
                  )}

                  {inviteLink && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Invite Link</DialogTitle>
                        <DialogDescription>
                          Your invite link is ready to share!
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full">
                        <Input
                          className="w-full p-2 bg-gray-100 rounded-lg pr-10"
                          value={inviteLink.inviteLink}
                          readOnly
                        />
                        <Button
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 size-7"
                          size="icon"
                          onClick={() =>
                            handleCopyInviteLink({
                              inviteLink: inviteLink.inviteLink
                            })
                          }
                        >
                          <Clipboard className="size-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
