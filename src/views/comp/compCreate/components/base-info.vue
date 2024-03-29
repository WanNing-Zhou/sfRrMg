<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="title"
      label="组件名称"
      :rules="[
        {
          required: true,
          message: $t('stepForm.form.error.activityName.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.title"
        :placeholder="$t('stepForm.placeholder.activityName')"
      />
    </a-form-item>
    <a-form-item
      label="预览图"
      :rules="[{ required: true, message: '请上传预览图' }]"
    >
      <div style="width: 100%">
        <wq-upload
          v-model="formData.preview_url"
          width="370"
          height="200"
          style="margin-bottom: 20px"
        ></wq-upload>
        <a-input v-model="formData.preview_url" placeholder="预览图地址" />
      </div>
    </a-form-item>
    <a-form-item
      field="deploy"
      label="创建方式"
      :rules="[
        {
          required: true,
          message: $t('stepForm.form.error.channelType.required'),
        },
      ]"
    >
      <a-select v-model="formData.deploy" placeholder="请选择创建方式">
        <a-option value="userUrl">URL创建</a-option>
        <a-option value="uploadUrl">上传方式创建</a-option>
      </a-select>
    </a-form-item>

    <a-form-item required field="column" label="默认列数">
      <a-input-number
        v-model="formData.column"
        placeholder="请输入"
        :min="1"
        :max="24"
      />
    </a-form-item>

    <a-form-item required field="row" label="默认行数">
      <a-input-number
        v-model="formData.row"
        placeholder="请输入"
        :min="1"
        :max="12"
      />
    </a-form-item>

    <a-form-item label="详细信息" row-class="keep-margin">
      <a-textarea
        v-model="formData.info"
        placeholder="这里填写组件的详细信息"
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('stepForm.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import WqUpload from '@/components/uploadComp/wqUpload.vue';
  import { BaseInfoModel } from '@/api/form';

  type Props = {
    base: any;
  };

  const props = defineProps<Props>();

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<BaseInfoModel | any>({
    title: '',
    deploy: '',
    preview_url: '',
    info: '',
    column: 1, // 组件默认占列数
    row: 1, // 组件默认占行数
  });

  watch(
    props,
    () => {
      formData.value = props.base;
    },
    { deep: true, immediate: true }
  );

  const onNextClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'forward', { ...formData.value });
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
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
    width: 500px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
