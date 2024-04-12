import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeAction$,
  Form,
  zod$,
} from "@builder.io/qwik-city";
import { responseDataAdapter } from "~/utils/common";
import { getDB } from "~/utils/db";

export const useSubscribe = routeAction$(
  async ({ email }, { error, fail, env }) => {
    const newsletter = env.get("NEWSLETTER_BLOG");
    const emailRegex = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi;

    if (!email) {
      return fail(400, {
        success: false,
        message: "Email cannot be empty!",
      });
    }
    if (!emailRegex.test(email)) {
      return fail(400, {
        success: false,
        message: "Email not valid",
      });
    }
    const db = getDB();

    try {
      // Insert record
      await db.execute({
        sql: "insert into newsletters(email, website) values(?, ?)",
        args: [email, newsletter],
      });
      const response = await db.execute({
        sql: "select * from newsletters where email = ? and website = ?",
        args: [email, newsletter],
      });
      const subscriber = responseDataAdapter(response);
      if (!subscriber[0]) {
        return fail(400, {
          success: false,
          message: "Sorry something isn't right, please retry!",
        });
      }
      return {
        success: true,
        message: "You've been subscribed!",
      };
    } catch (err: any) {
      if (err.message) {
        throw error(500, err.message);
      }
      throw err;
    }
  },
  zod$((z) => ({
    email: z.string(),
  }))
);

/**
 * @description Notification component
 */
export const Noty = (props: { type: string; message: string }) => {
  const styles = () =>
    props.type === "success"
      ? "p-4 text-green-800 bg-green-200"
      : "p-4 text-red-800 bg-red-200";
  return <div class={styles()}>{props.message}</div>;
};

/**
 * @description Loading animation component
 */
export const LoadingAnimation = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-8 h-8 animate-spin"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
      </svg>
    </div>
  );
};

export default component$(() => {
  const subscribe = useSubscribe();

  return (
    <div class="flex flex-col py-32 px-8 justify-center items-center">
      <h1 class="p-4 text-5xl font-bold gradient-text">The TurQw Newsletter</h1>
      <div class="text-left max-w-4xl">
        <p class="text-xl p-8 font-mono">
          Stay up-to-date on the latest tech trends and receive weekly curated
          developer content written by James and other impressive technical
          writers right inside your inbox. 😎
        </p>
        <hr />
      </div>
      <Form
        action={subscribe}
        class="flex justify-center p-4 w-full md:w-3/4 lg:w-5/6 max-w-3xl"
      >
        <input
          class="p-4 outline outline-purple-700 rounded-l-md w-3/5 font-mono text-purple-800"
          name="email"
          type="email"
        />
        <button
          class="p-4 font-sans text-xl outline outline-purple-600 bg-violet-800 hover:bg-violet-700 text-white active:bg-violet-900 rounded-r-md w-2/5"
          type="submit"
        >
          Subscribe
        </button>
      </Form>
      <div>{subscribe.isRunning && <LoadingAnimation />}</div>

      {subscribe.value && (
        <Noty
          message={subscribe.value?.message}
          type={subscribe.value?.success ? "success" : ""}
        ></Noty>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "The Turqw newsletter",
  meta: [
    {
      name: "description",
      content:
        "Stay up-to-date on the latest tech trends and receive weekly curated developer content written by James and other impressive technical writers right inside your inbox.",
    },
  ],
};
