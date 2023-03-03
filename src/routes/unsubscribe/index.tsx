import { component$, useSignal } from "@builder.io/qwik";

export default component$(() => {
  const subscribedEmail = useSignal("foody@jamesinkala.com");
  const subscribedWebsite = useSignal("localhost:3000/");

  return (
    <div class="flex flex-col py-32 justify-center items-center">
      <div class="text-xl p-4 font-mono">Newsletter mail footer example.</div>

      <div class="text-red-700 hover:text-red-600">
        <a
          href={`/unsubscribe/${subscribedEmail.value}/${subscribedWebsite.value}`}
        >
          Unsubscribe from this newsletter
        </a>
      </div>
    </div>
  );
});
