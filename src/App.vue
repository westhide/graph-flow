<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <MyTransition class="scroll-smooth">
        <KeepAlive :max="10">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <main class="w-screen h-screen flex justify-around items-center">
                <span> Suspense Fallback... </span>
              </main>
            </template>
          </Suspense>
        </KeepAlive>
      </MyTransition>
    </template>
  </RouterView>
</template>
