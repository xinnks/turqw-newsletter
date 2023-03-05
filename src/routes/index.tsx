import { component$, useSignal, useStore } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  server$,
} from "@builder.io/qwik-city";
import { responseDataAdapter } from "./utils";
import { connect } from "@libsql/client";

const newsletterBlog = import.meta.env.VITE_NEWSLETTER_BLOG;

/**
 * @description Initiates database tables and indexes at the server stage if this step was not done using the Turso CLI's SQL shell
 */
export const useInitiateNewsletterTable = routeLoader$(async () => {
  const db = connect({
    url: import.meta.env.VITE_DB_URL,
  });

  await db.execute(
    "create table if not exists newsletters(id integer primary key, email varchar(50), website varchar(50), created_at integer default (cast(unixepoch() as int)) )"
  );
  await db.execute(
    "create index if not exists index_newsletters_website on newsletters (website)"
  );
  await db.execute(
    "create unique index if not exists index_unique_newsletters_email_website on newsletters(email, website)"
  );
});

/**
 * @description Stores user subscription data into database
 * @param {string} email
 * @param {string} newsletter
 */
export const subscribeToNewsletter = server$(async (email, newsletter) => {
  if (!email || !newsletter) {
    return {
      success: false,
      message: "Email cannot be empty!",
    };
  }

  const db = connect({
    url: import.meta.env.VITE_DB_URL,
  });

  // Insert record
  await db.execute("insert into newsletters(email, website) values(?, ?)", [
    email,
    newsletter,
  ]);

  // Query record
  const response = await db.execute(
    "select * from newsletters where email = ? and website = ?",
    [email, newsletterBlog]
  );

  const subscriber = responseDataAdapter(response);

  return subscriber[0]
    ? {
        success: true,
        message: "You've been subscribed!",
      }
    : {
        success: false,
        message: "Sorry something isn't right, please retry!",
      };
});

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
  // Use loader to create newsletter table if not present
  useInitiateNewsletterTable();

  const email = useSignal("");
  const loading = useSignal(false);
  const emailRegex = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi;
  const notification = useStore({
    message: "",
    status: "",
  });

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
      <form
        class="flex justify-center p-4 w-full md:w-3/4 lg:w-5/6 max-w-3xl"
        preventdefault:submit
        onSubmit$={async () => {
          if (!emailRegex.test(email.value)) {
            alert("Email not valid!");
            return;
          }
          loading.value = true;
          const response = await subscribeToNewsletter(
            email.value,
            newsletterBlog
          );
          loading.value = false;
          notification.message = response.message;
          notification.status = response.success ? "success" : "error";
        }}
      >
        <input
          class="p-4 outline outline-purple-700 rounded-l-md w-3/5 font-mono text-purple-800"
          onInput$={(e) => {
            email.value = (e.target as HTMLInputElement).value;
          }}
          name="email"
          type="email"
        />
        <button
          class="p-4 font-sans text-xl outline outline-purple-600 bg-violet-800 hover:bg-violet-700 text-white active:bg-violet-900 rounded-r-md w-2/5"
          type="submit"
        >
          Subscribe
        </button>
      </form>
      <div>{loading.value && <LoadingAnimation />}</div>

      {notification.message && (
        <Noty message={notification.message} type={notification.status}></Noty>
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
