import {
  component$,
  useBrowserVisibleTask$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { type DocumentHead, server$, useLocation } from "@builder.io/qwik-city";
import { createClient } from "@libsql/client";
import { LoadingAnimation, Noty } from "~/routes";

export default component$(() => {
  const location = useLocation();
  const email = useSignal(location.params.email);
  const domain = useSignal(location.params.domain);

  const loading = useSignal(false);
  const notification = useStore({
    message: "",
    status: "",
  });

  /**
   * @description Unsubscribes user from newsletter
   * @returns {Object}
   */
  const unsubscribeFromNewsletter = server$(async () => {
    const db = createClient({
      url: import.meta.env.VITE_DB_URL,
    });
    const deleteRecord = await db.execute(
      "delete from newsletters where email = ? and website like ?",
      [email.value, domain.value]
    );

    if (!deleteRecord.success) {
      return {
        success: false,
        message: "Sorry, something isn't right, please reload the page!",
      };
    }

    return {
      success: true,
      message: "Unsubscribed!",
    };
  });

  useBrowserVisibleTask$(async () => {
    loading.value = true;
    const res = await unsubscribeFromNewsletter();
    notification.message = res.message;
    notification.status = res.success ? "success" : "error";
    loading.value = false;
  });

  return (
    <div class="flex flex-col py-32 justify-center items-center space-y-4">
      <h1 class="p-4 text-5xl font-bold gradient-text">The TurQw Newsletter</h1>

      {notification.message && !loading.value ? (
        <div class="flex flex-col justify-center items-center">
          <div class="text-xl p-4 font-mono">Sad to see you go!!</div>
          <span class="text-5xl">🥺</span>
        </div>
      ) : (
        <LoadingAnimation />
      )}

      <div>
        {notification.message && (
          <Noty
            message={notification.message}
            type={notification.status}
          ></Noty>
        )}
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
