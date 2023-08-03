<template>
  <div class="container w-full mt-6">
    <div class="justify-center">
      <div class="timeline">
        <ul class="list-none m-0 p-0">
          <li class="mb-12" v-for="(item, index) in items">
            <div :class="{'right': index % 2 === 0, 'left': index % 2 === 1, 'containerBis':true}">
              <div class="content bg-indigo-200/10 ing-offset-white ring-offset-1/2 ring-white/20 ring-1">
                  <div class="flex items-center space-x-4">
                    <img :src="getImagePath(item.logo)" alt="institution logo" class="w-14" />
                    <div>
                      <h4 class="text-lg md:text-xl font-semibold text-white"><span v-html="item.title"></span></h4>
                      <span class="text-sm font-semibold text-white"
                        >{{ item.period }}</span
                      >
                    </div>
                  </div>
                  <p class="mt-2 text-lg text-white text-left md:text-justify"><span v-html="item.description"></span></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const images = import.meta.globEager('../assets/img/*.png');

const getImagePath = (filename) => {
  const imagePath = `../assets/img/${filename}`;
  return images[imagePath]?.default || '';
};
</script>


<script>

export default {
  name: 'Timeline',
  props: {
    items: {
      type: Array,
      required: true,
    },
  }
};

</script>

<style>
/* Add your custom styles here */
</style>
