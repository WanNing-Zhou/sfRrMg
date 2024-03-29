<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      v-if="deploy === 'userUrl'"
      field="url"
      label="组件"
      :rules="[
        {
          required: true,
          message: '组件来源必填, 若没有来源可返回上一步使用上传方式创建组件',
        },
      ]"
    >
      <a-input v-model="formData.url" placeholder="这里填写组件的url" />
    </a-form-item>

    <a-form-item
      v-if="deploy === 'uploadUrl'"
      field="url"
      label="组件"
      :rules="[
        {
          required: true,
          message: '组件来源是必须项, 若不希望上传, 可以返回上一处使用url方式',
        },
      ]"
    >
      <wq-upload
        v-model="formData.url"
        width="80"
        height="80"
        :fill-bg-url="compressedImg"
        :upload-fn="submitComp"
        accept=".zip"
      ></wq-upload>
    </a-form-item>

    <a-form-item>
      <!-- <a-button type="primary" @click="onNextClick">
        {{ $t('stepForm.button.next') }}
      </a-button> -->
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('stepForm.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('stepForm.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ChannelInfoModel } from '@/api/form';
  import WqUpload from '@/components/uploadComp/wqUpload.vue';
  import compressedImg from '@/assets/images/upload-compressed.png';
  import { compUpload, fileUpload } from '@/api/file';

  type Props = {
    deploy: 'userUrl' | 'uploadUrl'; // 上传方式
    base: any;
  };

  const props = defineProps<Props>();

  const emits = defineEmits(['changeStep']);

  const formRef = ref<FormInstance>();
  const formData = ref({
    url: '',
  });


  watch(
    props.base,
    (newValue) => {
      formData.value = newValue as any;
    },
    { deep: true, immediate: true }
  );

  const onNextClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'submit', { ...formData.value });
    }
  };
  const goPrev = () => {
    emits('changeStep', 'backward');
  };

  const submitComp = async (file: File) => {
    if (file) {
      const form = new FormData();
      form.append('files', file);
      const res = await compUpload(form);
      // 获取返回信息
      const { url } = res.data;
      console.log('compUrl', url);
      return url;
    }
    return '';
  };
</script>

<style scoped lang="less">
  .container {
    .keep-margin {
      margin-bottom: 20px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
  }

  .steps {
    margin-bottom: 36px;
  }

  .form {
    width: 540px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
