<template>
  <a-modal v-model:visible="visible" hide-cancel @ok="handleSubmit" width="800">
    <template #title> 修改密码 </template>
    <a-form
      :hide-label="true"
      ref="form"
      :model="formData"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-model="formData.oldPassword"
          placeholder="旧密码"
          type="password"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-model="formData.newPassword"
          placeholder="新密码"
          type="password"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-model="rePassword"
          type="password"
          placeholder="再次输入新密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import useUser from '@/hooks/user';

  type Props = {
    visible: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
  });

  const emits = defineEmits(['update:visible']);

  // 对话框可见性
  const visible = computed({
    get() {
      return props.visible;
    },
    set(newValue) {
      emits('update:visible', false);
    },
  });

  const form = ref();

  // 用户密码提交表单
  const formData = ref({
    oldPassword: '',
    newPassword: '',
  });

  const rePassword = ref('');
  const { logout } = useUser();

  const userStore = useUserStore();
  const handleSubmit = async () => {
    if (rePassword.value !== formData.value.newPassword) {
      Message.error('密码输入不一致');
      return;
    }
    await userStore.resetPassword(formData.value);
    await logout();

    // console.log('ok');
  };

  const handleCancel = () => {
    visible.value = false;
  };
</script>

<style lang="scss" scoped></style>
