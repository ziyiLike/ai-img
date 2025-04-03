import axios, { type AxiosRequestConfig } from 'axios'

interface IRequest extends AxiosRequestConfig<any> {
  onSuccess?: (res: any) => void
  onError?: (err: any) => void
  onFinally?: () => void
}

export const useRequest = (props: IRequest) => {
  axios(props)
    .then((res) => props.onSuccess?.(res))
    .catch((err) => props.onError?.(err))
    .finally(() => props.onFinally?.())
}
