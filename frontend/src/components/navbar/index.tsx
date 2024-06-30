import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/icons';
import { IoMenu } from 'react-icons/io5';
import { SignOut } from '@/components/common/sign-out';
import { paths } from '@/utils/paths';

export const Navbar = () => {
  return (
    <header className="bg-primary py-4 px-6 md:px-8 lg:px-10">
      <div className="md:container flex justify-between items-center">
        <Link
          className="text-base md:text-2xl font-bold flex items-center text-secondary"
          href={paths.auth.dashboard}
        >
          <Icons.soccer className="size-12 mr-2" />
          Soccer Match
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <SignOut />
        </nav>
        <Button
          className="md:hidden text-secondary"
          variant="ghost"
          size="icon"
        >
          <IoMenu className="size-8" />
        </Button>
      </div>
    </header>
  );
};
