import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetAttributify({}), presetUno()],
  rules: [],
  shortcuts: [
    {
      'border-common': 'border-1px border-solid border-#e8e8e8',
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-around': 'flex justify-around items-center',
      'flex-end': 'flex justify-end items-center',
      'flex-start': 'flex justify-start items-center',
    },
  ],
})
