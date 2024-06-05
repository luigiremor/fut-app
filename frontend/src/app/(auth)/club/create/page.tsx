import { CreateClubForm } from '@/components/form/create-club-form';

export default function ClubCreate() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col max-w-lg w-full">
        <h2 className="text-xl font-medium">Create a new club</h2>
        <CreateClubForm />
      </div>
    </div>
  );
}
