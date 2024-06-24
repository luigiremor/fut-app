import { CreateMatchForm } from '@/components/form/create-match-form';

export default function CreateMatch({
  params
}: {
  params: { clubName: string };
}) {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col max-w-lg w-full">
        <h2 className="text-xl font-medium">Create a new match</h2>
        <CreateMatchForm clubName={params.clubName} />
      </div>
    </div>
  );
}
