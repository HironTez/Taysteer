import Recipes from "../components/recipes";
import { authGuard } from "../internal-actions/auth";

const Favorites = async () => {
  const viewer = await authGuard();

  return <Recipes userId={viewer.id} favorites />;
};

export default Favorites;
