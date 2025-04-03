import type { ShallowRef } from 'vue'

export default function (el: ShallowRef<any>, initScroll: boolean = false) {
  const isUserScrolling = ref(initScroll)

  // 监听滚动事件
  const handleScroll = () => {
    isUserScrolling.value = true
  }

  const scrollToBottom = () => {
    if (
      !isUserScrolling.value ||
      (isUserScrolling.value && el.value.scrollTop + el.value.clientHeight >= el.value.scrollHeight)
    ) {
      el.value.scrollIntoView({ behavior: 'smooth' })
      el.value.scrollTop = el.value.scrollHeight
    }
  }

  return {
    isUserScrolling,
    scrollToBottom,
  }
}
