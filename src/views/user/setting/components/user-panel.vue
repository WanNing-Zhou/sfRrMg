<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-upload
        :custom-request="customRequest"
        list-type="picture-card"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        @success="successHandle"
      >
        <template #upload-button>
          <a-avatar :size="100" class="info-avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <img v-if="fileList.length" :src="fileList[0].url" />
          </a-avatar>
        </template>
      </a-upload>
      <a-descriptions
        :data="renderData"
        :column="2"
        align="right"
        layout="inline-horizontal"
        :label-style="{
          width: '140px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <template #label="{ label }">{{ $t(label) }} :</template>
        <template #value="{ value }">
          <!--          <a-tag
            v-if="data.label === 'userSetting.label.certification'"
            color="green"
            size="small"
          >
            已认证
          </a-tag>-->
          <span>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { useUserStore } from '@/store';
  import { userUploadApi } from '@/api/user-center';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import defaultAvatar from '@/assets/images/user-defalut-avatar.png';
  import { formatToDay } from '@/utils/day';

  const userStore = useUserStore();
  // const uploadUrl = import.meta.env.VITE_API_UPLOAD_URL;
  // console.log(uploadUrl);
  const avatarUrl = {
    uid: '-2',
    name: 'avatar.png',
    url: userStore.avatar || defaultAvatar,
  };

  const renderData = [
    {
      label: 'userSetting.label.name',
      value: userStore.name,
    },
    {
      label: 'userSetting.label.accountId',
      // value: userStore.accountId,
      value: userStore.id,
    },
    {
      label: 'userSetting.label.phone',
      value: userStore.mobile,
    },
    {
      label: 'userSetting.label.registrationDate',
      value: formatToDay(userStore.created_at),
    },
  ] as DescData[];
  // const fileList = ref<FileItem[]>([avatarUrl]);

  const fileList = computed(() => {
    const fileItem = {
      uid: '-2',
      name: 'avantar',
      url: userStore.avatar || defaultAvatar,
    };
    return [fileItem];
  });

  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };

      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await userUploadApi(formData, {
          controller,
          onUploadProgress,
        });
        // console.log('res',res);
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };

  const successHandle = async (res: any) => {
    // fileList.value = [res.data.url]
    const { url } = res.response.data;
    // console.log(res);
    userStore.$patch({
      avatar: url,
    });
    // console.log(userStore.avatar);
    await userStore.updateInfo(); // 更新用户信息
    // console.log('success', url);
    // userStore.setInfo()
  };
</script>

<style scoped lang="less">
  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }
  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;
    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
