<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="mobile"
      :label="$t('userSetting.basicInfo.form.label.phone')"
    >
      <a-input v-model="formData.mobile" :placeholder="'请输入电话号码'" />
    </a-form-item>
    <a-form-item
      field="name"
      :label="$t('userSetting.basicInfo.form.label.nickname')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.nickname.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.name"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      :label="$t('userSetting.basicInfo.form.label.profile')"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.introduction"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { BasicInfoModel } from '@/api/user-center';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';

  const userStore = useUserStore();
  const formRef = ref<FormInstance>();

  const orgData = computed(() => {
    const { mobile, name, introduction } = userStore;
    return {
      mobile,
      name,
      introduction,
    };
  });

  const formData = ref<BasicInfoModel | any>({ ...orgData.value });
  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      userStore.$patch({ ...formData.value });
      try {
        await userStore.updateInfo();
        // formData.value = { ...orgData };
        Message.success({
          content: '更新成功',
        });
      } catch (err) {
        Modal.error({ content: '更新失败' });
      }

      // do some thing
      // you also can use html-type to submit
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
