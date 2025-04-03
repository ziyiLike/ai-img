<script setup lang="ts">
import Chat from '@/components/Chat.vue'

const messageList = ref([])
</script>

<template>
  <div class="w-full h-100vh bg-gray-1 flex justify-center p-20px">
    <div class="w-full h-full bg-white rounded-xl">
      <Chat :messageList="messageList" />
    </div>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
