import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="min-h-[100vh] bg-gray-50">
      <main>
        <section>
          <Slot />
        </section>
      </main>
      <footer></footer>
    </div>
  );
});
