import Recipes from "./components/recipes";

export default async function Home() {
  return (
    <>
      <p>Discover recipes:</p>
      <Recipes />;
    </>
  );
}

// TODO: video uploading support for recipe steps
// TODO: show user's recipe list in profile
// TODO: preview image on upload
// TODO: recipe tags
