import { ref } from 'vue'
import { ElNotification } from 'element-plus'

export default function (text: string) {
  const isCopied = ref(false)

  try {
    navigator.clipboard.writeText(text)
    isCopied.value = true
    ElNotification.success('复制成功')
  } catch (error) {
    isCopied.value = false
    ElNotification.error('复制失败')
  }

  return { isCopied }
}
