import { EditProfile } from "../../edit/EditProfile";

type EditByIdProps = {
  params: { userId: string };
};

export default function EditById({ params }: EditByIdProps) {
  return <EditProfile userId={params.userId} />;
}
