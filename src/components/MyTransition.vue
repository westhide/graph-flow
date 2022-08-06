<template>
  <Transition name="fade" mode="out-in" appear>
    <!--    ! Transition need root element to take effect-->
    <div>
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
