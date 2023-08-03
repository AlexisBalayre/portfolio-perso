<template>
  <section class="skills mt-6">
    <div class="container mx-auto px-4 rounded-xl lg:grid-cols-3 gap-8 bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1 p-6">
      <div
        v-for="category in items"
        :key="category.name"
        class="skill-category md:mb-8 mb-6"
      >
        <h3 class="text-xl font-semibold mb-4 text-white">{{ category.name }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div
            v-for="skill in category.skills"
            :key="skill.name"
            class="p-4"
          >
            <h4 class="text-lg text-white font-semibold mb-2">{{ skill.name }}</h4>
            <div class="flex items-center">
              <div class="progress-bar-container bg-[#09162E] w-full h-2 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500"
                  :style="{ width: skill.percentage + '%' }"
                ></div>
              </div>
              <span class="text-sm text-white ml-2">{{ skill.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Skills',
  props: {
    items: {
      type: Array,
      required: true,
    },
  }
};
</script>

