<script lang="tsx" setup>
import { CopySVG, CopySVGString, LoadingSVG } from './Icon'
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import useCopyText from '@/utils/useCopyText'
import useGetRandom from '@/utils/useGetRandom'

const codeBindMap = ref<Record<string, any>>({})

const md = markdownit({
  html: true,
  linkify: true,
  highlight: (str, lang) => {
    let highlighted = ''
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(str, { language: lang }).value
      } catch (__) {
        highlighted = md.utils.escapeHtml(str)
      }
    } else {
      highlighted = md.utils.escapeHtml(str)
    }

    const uniqueId = codeBindMap.value[str] ? codeBindMap.value[str].id : useGetRandom()
    if (!codeBindMap.value[str]) {
      codeBindMap.value[str] = {
        id: uniqueId,
        event: () => useCopyText(str),
      }
    }
    return `<div class="w-[calc(50vw-250px)]  flex flex-col overflow-x-auto">
          <div class="flex justify-between bg-gray-2 h-30px w-full px-10px items-center text-#666">
            <span>${lang.toLocaleUpperCase()}</span>
            <span class="hover:text-blue-5 cursor-pointer flex items-center gap-5px copy-btn-${uniqueId}">${CopySVGString} <span>复制代码</span> </span>
          </div>
          <div class="break-all w-full p-15px">${highlighted}</div>
        </div>`
  },
})

const props = withDefaults(
  defineProps<{
    loading?: boolean // 是否加载状态
    loadingText?: string // 加载状态文案
    placement?: 'left' | 'right' // 气泡位置
    content?: string // 默认内容
    header?: string // 头部内容
    error?: string // 头部内容
  }>(),
  {
    content: '',
    loadingText: 'Loading...',
  },
)

// 定义slots
const slots = useSlots()

// 代码块复制
watch(
  () => props.content,
  () => {
    nextTick(() => {
      Object.keys(codeBindMap.value).forEach((key) => {
        const copyBtn = document.querySelector(`.copy-btn-${codeBindMap.value[key].id}`)
        if (copyBtn) {
          copyBtn.removeEventListener('click', codeBindMap.value[key].event)
          copyBtn.addEventListener('click', codeBindMap.value[key].event)
        }
      })
    })
  },
)
</script>

<template>
  <div
    :class="[
      'flex',
      'flex-start',
      'items-start',
      'mb-20px',
      `${props.placement === 'left' ? 'flex-row' : 'flex-row-reverse'}`,
    ]"
  >
    <!-- Avatar插槽 -->
    <div
      v-if="slots.avatar"
      :class="[
        `w-32px h-32px flex-center rounded-full  text-white ${
          props.placement === 'left' ? 'bg-gray-1 mr-10px' : 'bg-#87D068 ml-10px'
        }`,
      ]"
    >
      <slot name="avatar"></slot>
    </div>

    <div class="flex flex-col items-start">
      <!-- Header插槽 -->
      <div v-if="slots.header || props.header" class="text-12px color-#666 mb-5px">
        <slot name="header">
          {{ props.header }}
        </slot>
      </div>

      <!-- 内容区域 -->
      <div
        class="bg-#f5f5f5 p-10px rounded-4px max-w-[calc(100vw-40px)] break-words markdown-body m-0 [&_p]:mb-0!"
      >
        <div v-if="props.loading" class="text-center color-#999999 text-blue">
          <el-icon class="transform rotate-255 animate-[rotating_1s_linear_infinite] mr-10px">
            <LoadingSVG />
          </el-icon>
          {{ props.loadingText }}
        </div>
        <div v-else>
          <span v-if="props.error">
            <el-icon class="text-red relative top-2px"><Warning /></el-icon>
            {{ props.error }}
          </span>
          <article v-else v-html="md.render(props.content)"></article>
        </div>
      </div>

      <!-- Footer插槽 -->
      <div v-if="slots.footer" class="text-12px color-#666 mt-10px">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bubble {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;

  &--left {
    flex-direction: row;
  }

  &--right {
    flex-direction: row-reverse;
  }
}
</style>
