import { ref, onUnmounted } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { FetchEventSourceInit } from '@microsoft/fetch-event-source/lib/cjs/fetch'

export default function (url: string, options?: FetchEventSourceInit) {
  const data = ref<any>(null)
  const error = ref<Error | null>(null)
  const status = ref<'START' | 'CONNECTED' | 'PENDING' | 'DISCONNECTED'>('START')
  const loading = ref<boolean>(false)

  let controller: AbortController | null = null

  const connect = async (
    body: string,
    handler: {
      onOpen?: (...args: any[]) => void
      onData?: (...args: any[]) => void
      onError?: (...args: any[]) => void
      onClose?: (...args: any[]) => void
    },
  ) => {
    data.value = null
    loading.value = true

    if (controller) {
      controller.abort()
    }
    controller = new AbortController()

    await fetchEventSource(url, {
      ...options,
      body,
      signal: controller.signal,
      onopen: async (response) => {
        if (response.ok) {
          status.value = 'CONNECTED'
          handler.onOpen && handler.onOpen(response)
        } else {
          throw new Error(`Failed to connect to event source: ${response.statusText}`)
        }
      },
      onmessage: (event) => {
        if (event.data !== '[DONE]') {
          status.value = 'PENDING'
          try {
            data.value = JSON.parse(event.data)
            handler.onData && handler.onData(data.value)
          } catch (err) {
            console.error('Failed to parse message:', err)
            error.value = err as Error
            handler.onError && handler.onError(error.value)
          }
        }
      },
      onerror: (err) => {
        error.value = err
        loading.value = false
        handler.onError && handler.onError(error.value)
        throw err
      },
      onclose: () => {
        status.value = 'DISCONNECTED'
        loading.value = false
        handler.onClose && handler.onClose()
      },
    })
  }

  onUnmounted(() => {
    if (controller) {
      controller.abort()
    }
  })

  const disconnect = () => {
    if (controller) {
      controller.abort()
      loading.value = false
    }
  }

  return {
    data,
    error,
    status,
    loading,
    connect,
    disconnect,
  }
}
