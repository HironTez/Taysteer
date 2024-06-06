import Recipes from "./components/recipes";

export default async function Home() {
  return (
    <>
      <p>Discover recipes:</p>
      <Recipes />
    </>
  );
}

// FIXME: cache revalidation in TOR Browser
// TODO: preview image on upload
// TODO?: recipe tags
// TODO?: video uploading support for recipe steps
// TODO?: recipe search -- relevant prisma functionality required
