<script lang="tsx" setup>
import useEventSource from '@/utils/useEventSource'
import { UserFilled } from '@element-plus/icons-vue'
import { QWenSVG } from './Icon'
import { promptMap } from '@/components/promptMap'
import useScrollToBottom from '@/utils/useScrollToBottom'
import { useRequest } from '@/utils/useRequest'
import useGetRandom from '@/utils/useGetRandom'

const settingsDialogRef = shallowRef()

const props = defineProps<{
  messageList: IMessage[]
}>()

const messages = useModel(props, 'messageList')

const activeConfig = computed(() =>
  JSON.parse(
    localStorage.getItem('settings') ||
      JSON.stringify({
        apiKey: '',
        model: 'Qwen/Qwen2.5-7B-Instruct',
        image_model: 'Kwai-Kolors/Kolors',
        imageSize: '1024x1024',
        num_inference_steps: 20,
        guidance_scale: 7.5,
      }),
  ),
)

messages.value.push({
  header: activeConfig.value.model,
  placement: 'left',
  role: 'assistant',
  loading: false,
  content: `你好，请描述需要生成的图像`,
})

const chatRef = shallowRef<HTMLDivElement>()

const state = reactive({
  input: '',
  systemPrompt: [
    {
      role: 'system',
      content: promptMap.text,
    },
    {
      role: 'user',
      content:
        '在海边的一个小岛上，海鸥飞舞，幽邃的月光透过灯塔照在海面上，船所在的海面上有一鱼群在飞舞',
    },
    {
      role: 'assistant',
      content:
        'an island near sea, with seagulls, moon shining over the sea, light house, boats int he background, fish flying over the sea',
    },
  ],
})

const handleOpenSettings = () => {
  settingsDialogRef.value.openForm()
}

const { loading, status, connect, disconnect } = useEventSource(
  'https://api.siliconflow.cn/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeConfig.value.apiKey}`,
    },
  },
)

const senderSubmit = () => {
  messages.value.push({
    placement: 'right',
    role: 'user',
    content: state.input,
  })

  const assistantMessage = ref<IMessage>({
    header: activeConfig.value.model,
    created: '',
    placement: 'left',
    loading: true,
    role: 'assistant',
    content: '',
    error: '',
  })

  messages.value.push(assistantMessage.value)

  const { scrollToBottom } = useScrollToBottom(chatRef)

  connect(
    JSON.stringify({
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeConfig.value.apiKey}`,
      },
      model: activeConfig.value.model,
      messages: [...state.systemPrompt, ...messages.value],
      stream: true,
    }),
    {
      onData: (data) => {
        assistantMessage.value.loading = false
        if (data) {
          assistantMessage.value.header = data['model']
          assistantMessage.value.created = data['created']
          assistantMessage.value.content +=
            (data['choices'][0]['delta']['content'] ||
              data['choices'][0]['delta']['reasoning_content']) ??
            ''
          scrollToBottom()
        }
      },
      onError: (error) => {
        assistantMessage.value.loading = false
        assistantMessage.value.error = error
      },
      onClose: () => {
        assistantMessage.value.loading = false
        if (status.value === 'DISCONNECTED' && assistantMessage.value.content) {
          genImageRequest(assistantMessage.value.content)
        }
      },
    },
  )
}

const genImageRequest = (prompt: string, seed = parseInt(useGetRandom(10, '1234567890'))) => {
  const assistantMessageImg: IMessage = ref({
    placement: 'left',
    role: 'assistant',
    content: '',
    loading: true,
    loadingText: '正在生成图中...',
  })
  messages.value.push(assistantMessageImg.value)
  useRequest({
    url: 'https://api.siliconflow.cn/v1/images/generations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeConfig.value.apiKey}`,
    },
    data: {
      seed,
      model: activeConfig.value.image_model,
      prompt: prompt,
      negative_prompt: '<string>',
      image_size: activeConfig.value.image_size,
      batch_size: activeConfig.value.batch_size,
      num_inference_steps: activeConfig.value.num_inference_steps,
      guidance_scale: activeConfig.value.guidance_scale,
    },
    onSuccess(res) {
      assistantMessageImg.value.content = `<img src="${res.data.images[0].url}"></img>`
      assistantMessageImg.value.imgPrompt = prompt
      assistantMessageImg.value.seed = seed
    },
    onError(err) {
      assistantMessageImg.value.error = err.response.data.message
    },
    onFinally() {
      assistantMessageImg.value.loading = false
    },
  })
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-20px p-20px overflow-hidden">
    <div class="text-18px mb-20px flex justify-between">
      <span>生图工具</span>
      <el-space>
        <el-link
          class="text-20px"
          :underline="false"
          icon="Setting"
          @click="handleOpenSettings"
        ></el-link>
      </el-space>
    </div>
    <div ref="chatRef" class="w-full flex-1 overflow-y-auto">
      <Bubble v-for="message in messages" v-bind="message">
        <template #avatar>
          <el-icon v-if="message.role === 'assistant'" class="text-20px">
            <QWenSVG />
          </el-icon>
          <el-icon v-else>
            <UserFilled />
          </el-icon>
        </template>

        <template #footer v-if="message.imgPrompt">
          <el-space>
            <el-link
              icon="Refresh"
              title="重新生成"
              :underline="false"
              @click="genImageRequest(message.imgPrompt)"
            ></el-link>
            <el-link
              icon="Switch"
              title="固定风格重新生成"
              :underline="false"
              @click="message.imgPrompt && genImageRequest(message.imgPrompt, message.seed)"
            ></el-link>
          </el-space>
        </template>
      </Bubble>
    </div>

    <div class="min-h-50px">
      <Sender
        v-model="state.input"
        :loading="loading"
        @send="senderSubmit"
        @disconnect="disconnect"
      />
    </div>

    <SettingsDialog ref="settingsDialogRef" />
  </div>
</template>
