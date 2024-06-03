import { CreateClubForm } from '@/components/form/create-club-form';

export default function ClubCreate() {
  return (
    <div className="flex flex-col ">
      <h2 className="text-xl font-medium">Create a new club</h2>
      <CreateClubForm />
    </div>
  );
}
