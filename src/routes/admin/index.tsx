import {
  $,
  component$,
  Resource,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { connect } from "@libsql/client";
import { type NewsletterSubscriber, responseDataAdapter } from "~/routes/utils";
import { LoadingAnimation, Noty } from "..";
const db = connect({
  url: import.meta.env.VITE_DB_URL,
});

interface ResourceResponse {
  message: string;
  data: [];
}

/**
 * @description Formats date to dd/MM/YYYY format
 * @param {Number} dateInt - Unix time
 * @returns {String}
 */
export const formatDate = $((dateInt: number) => {
  const date = new Date(dateInt * 1000);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
});

export default component$(() => {
  /**
   * @description Fetches subscribers from the database
   * @returns {Object}
   */
  const subscribersResource = useResource$<ResourceResponse>(async () => {
    const response = await db.execute("select * from newsletters");

    const subscribers = response?.success ? responseDataAdapter(response) : [];

    return {
      message: "Fetched subscribers",
      data: subscribers,
    };
  });

  /**
   * @description Subscriber rows extracted component
   * @param {Array} subscribers
   * @returns
   */
  const subscriberRows = (subscribers: []) => {
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

      <Resource
        value={subscribersResource}
        onRejected={() => (
          <Noty message="Failed to fetch subscribers" type="error"></Noty>
        )}
        onPending={() => <LoadingAnimation />}
        onResolved={(res: ResourceResponse) => (
          <table class="min-w-full text-left text-sm font-light">
            <thead class="border-b font-medium dark:border-neutral-500">
              <tr>
                <th class="px-6 py-4">No.</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Website</th>
                <th class="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>{subscriberRows(res.data)}</tbody>
          </table>
        )}
      ></Resource>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Admin Portal - The Turqw newsletter",
};
