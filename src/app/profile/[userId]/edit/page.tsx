import { Edit } from "../../edit/Edit";

type EditByIdProps = {
  params: { userId: string };
};

export default function EditById({ params }: EditByIdProps) {
  return <Edit userId={params.userId} />;
}
