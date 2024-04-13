import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDB } from "~/utils/db";

export const useUnsubscribe = routeLoader$(async ({ params, error }) => {
  const email = params.email;
  const domain = params.domain;
  const db = getDB();
  try {
    await db.execute({
      sql: "delete from newsletters where email = ? and website like ?",
      args: [email, domain],
    });
  } catch (err) {
    throw error(500, "Sorry, something isn't right, please reload the page!");
  }
});
export default component$(() => {
  useUnsubscribe();
  return (
    <div class="flex flex-col py-32 justify-center items-center space-y-4">
      <h1 class="p-4 text-5xl font-bold gradient-text">The TurQw Newsletter</h1>

      <div class="flex flex-col justify-center items-center">
        <div class="text-xl p-4 font-mono">Sad to see you go!!</div>
        <span class="text-5xl">🥺</span>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Unsubscribing - The Turqw newsletter",
  meta: [
    {
      name: "description",
      content: "Unsubscribing from the Turwq Nesletter.",
    },
  ],
};
