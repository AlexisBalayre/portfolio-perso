<template>
  <div class="service-card shadow rounded-xl p-6 flex flex-col items-center bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1">
    <div class="icon text-4xl mb-4 text-white">
      <font-awesome-icon :icon="icon" />
    </div>
    <h3 class="title text-xl font-semibold mb-4 text-white text-center">{{ title }}</h3>
    <p class="description text-center text-white">{{ description }}</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.service-card {
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}
</style>
