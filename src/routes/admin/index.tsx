import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import {
  type NewsletterSubscriber,
  responseDataAdapter,
  formatDate,
} from "~/utils/common";
import { getDB } from "~/utils/db";

export const useSubscribers = routeLoader$(async ({ error }) => {
  try {
    const db = getDB();
    const response = await db.execute("select * from newsletters");
    const subscribers = responseDataAdapter(response);
    return subscribers;
  } catch (err: any) {
    if (err.message) {
      throw error(500, err.message);
    }
    throw err;
  }
});

export default component$(() => {
  const subscribers = useSubscribers();

  const subscriberRows = (subscribers: NewsletterSubscriber[]) => {
    return subscribers?.length < 1 ? (
      <tr>
        <td
          class="whitespace-nowrap px-6 py-4 font-medium hover:bg-gray-300 text-center"
          colSpan={4}
        >
          No subscribers found
        </td>
      </tr>
    ) : (
      subscribers?.map((sub: NewsletterSubscriber, index: number) => {
        return (
          <tr key={sub.id} class="hover:bg-gray-200">
            <td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
            <td class="whitespace-nowrap px-6 py-4 font-medium">{sub.email}</td>
            <td class="whitespace-nowrap px-6 py-4 font-medium">
              {sub.website}
            </td>
            <td class="whitespace-nowrap px-6 py-4 font-medium">
              {formatDate(sub.created_at)}
            </td>
          </tr>
        );
      })
    );
  };

  return (
    <div class="flex flex-col space-y-8 p-8 justify-center items-center max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold">Newsletter Subscribers</h1>
      <table class="min-w-full text-left text-sm font-light">
        <thead class="border-b font-medium dark:border-neutral-500">
          <tr>
            <th class="px-6 py-4">No.</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">Website</th>
            <th class="px-6 py-4">Joined</th>
          </tr>
        </thead>
        <tbody>{subscriberRows(subscribers.value)}</tbody>
      </table>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Admin Portal - The Turqw newsletter",
};
