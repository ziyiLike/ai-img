<script lang="tsx" setup>
import { SendSVG, LoadingCircleSVG } from '@/components/Icon'

const props = defineProps<{
  modelValue: string
  loading: boolean
}>()

const emit = defineEmits(['update:modelValue', 'send', 'disconnect'])

const input = useModel(props, 'modelValue')

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('send')
    input.value = ''
  }
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    input.value += '\n'
  }
}

const toggleClick = () => {
  if (props.loading) {
    emit('disconnect')
  } else {
    emit('send')
    input.value = ''
  }
}
</script>

<template>
  <div class="w-full relative">
    <el-input
      v-model="input"
      :autosize="{
        minRows: 1,
      }"
      input-style="padding-right:40px;border-radius:5px;line-height:35px"
      placeholder="请输入您的需求，Enter发送，Shift+Enter换行"
      resize="none"
      type="textarea"
      @keydown="handleKeyUp"
    >
    </el-input>

    <el-button
      circle
      class="absolute right-10px bottom-6px"
      :style="{ color: input.trim() || loading ? 'var(--el-color-primary)' : '' }"
      plain
      :disabled="!loading && !input.trim()"
    >
      <template #icon>
        <el-icon :class="[`text-24px ${loading ? 'is-loading' : ''}`]" @click="toggleClick">
          <LoadingCircleSVG v-if="loading" />
          <SendSVG v-else />
        </el-icon>
      </template>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px var(--el-input-focus-border-color) inset;
}
</style>
