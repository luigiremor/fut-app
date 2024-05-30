import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '../common/icons';
import { cn } from '@/lib/utils';
import { IoMenu } from 'react-icons/io5';

export const Navbar = () => {
  return (
    <header className="bg-primary py-4 px-6 md:px-8 lg:px-10">
      <div className="md:container flex justify-between items-center">
        <Link
          className="text-base md:text-2xl font-bold flex items-center text-secondary"
          href="#"
        >
          <Icons.soccer className="size-12 mr-2" />
          Soccer Match
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            className={cn(
              buttonVariants({
                variant: 'link'
              }),
              'text-white'
            )}
            href="#"
          >
            Teams
          </Link>
          <Link
            className={cn(
              buttonVariants({
                variant: 'link'
              }),
              'text-white'
            )}
            href="#"
          >
            Games
          </Link>
          <Button variant="secondary" className="text-primary">
            Join Game
          </Button>
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
