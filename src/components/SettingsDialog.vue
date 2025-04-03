<script setup lang="tsx">
const show = ref(false)

const openForm = () => {
  show.value = true

  form.value = JSON.parse(
    localStorage.getItem('settings') ||
      JSON.stringify({
        apiKey: '',
        model: 'Qwen/Qwen2.5-7B-Instruct',
        image_model: 'Kwai-Kolors/Kolors',
        imageSize: '1024x1024',
        num_inference_steps: 20,
        guidance_scale: 7.5,
      }),
  )
}

const form = ref<any>({})

const handleSubmit = () => {
  localStorage.setItem('settings', JSON.stringify(form.value))
  show.value = false
}

defineExpose({
  openForm,
})
</script>

<template>
  <el-dialog v-model="show" title="Settings" width="90%">
    <el-alert type="info" :closable="false">
      <div>
        <p>
          How to get your API key:&nbsp;
          <el-link type="primary" target="_blank" href="https://cloud.siliconflow.cn/account/ak"
            >https://cloud.siliconflow.cn/account/ak</el-link
          >
        </p>
      </div>
    </el-alert>
    <el-form class="mt-20px" :label-width="150">
      <el-form-item label="API Key">
        <el-input v-model="form.apiKey" placeholder="Enter your API key" />
      </el-form-item>
      <el-form-item label="Text Model">
        <el-select v-model="form.model" placeholder="Select a model">
          <el-option label="Qwen/Qwen2.5-7B-Instruct" value="Qwen/Qwen2.5-7B-Instruct" />
          <el-option label="Qwen/Qwen2-7B-Instruct" value="Qwen/Qwen2-7B-Instruct" />
          <el-option
            label="Qwen/Qwen2.5-Coder-7B-Instruct"
            value="Qwen/Qwen2.5-Coder-7B-Instruct"
          />
          <el-option label="Qwen/Qwen2.5-72B-Instruct" value="Qwen/Qwen2.5-72B-Instruct" />
          <el-option
            label="deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
            value="deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Image Model">
        <el-select v-model="form.image_model" placeholder="Select a model">
          <el-option label="Kwai-Kolors/Kolors" value="Kwai-Kolors/Kolors" />
        </el-select>
      </el-form-item>
      <el-form-item label="Image Size">
        <el-select v-model="form.image_size" placeholder="Select a size">
          <el-option label="768x1024" value="768x1024" />
          <el-option label="720x1440" value="720x1440" />
          <el-option label="720x1280" value="720x1280" />
          <el-option label="960x1280" value="960x1280" />
          <el-option label="1024x1024" value="1024x1024" />
          <el-option label="1920x1080" value="1920x1080" />
          <el-option label="2560x1440" value="2560x1440" />
          <el-option label="3840x2160" value="3840x2160" />
        </el-select>
      </el-form-item>
      <el-form-item label="Inference Steps">
        <el-input-number v-model="form.num_inference_steps" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="Guidance Scale">
        <el-input-number v-model="form.guidance_scale" :min="1" :max="20" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="show = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" icon="Check">Save</el-button>
    </template>
  </el-dialog>
</template>
