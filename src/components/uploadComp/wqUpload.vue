<template>
  <div
    :style="{
      width: Number(width) + 'px',
      height: Number(height) + 'px',
      lineHeight: Number(height) + 'px',
    }"
    class="upload-avatar"
  >
    <div :class="type" class="avatar" @click="uploadPhoto">
      <div
        v-if="defaultPhoto"
        :style="{ 'background-image': 'url(' + defaultPhoto + ')' }"
        class="pic"
      ></div>
      <div v-else class="bg-icon">
        <slot name="bgIcon">
          <icon-plus />
        </slot>
      </div>
      <!--      <div class="mask">
              <i class="iconfont icon-paizhao-"></i>
            </div>-->
    </div>
    <input
      v-show="false"
      ref="fileInputDom"
      :accept="accept"
      class="file_input_file"
      type="file"
      @change="uploadFileChange($event)"
    />
  </div>
</template>

<script lang="tsx" setup>
  import { computed, ref } from 'vue';
  import { fileOverSize } from '@/utils/message';
  import { fileUpload } from '@/api/file';
  // import SvgIcon from '@/components/SvgIcon/SvgIcon.vue';

  type Prop = {
    type?: 'rect' | 'circle'; // 形状
    suffix?: 'string'; // 后缀
    uploadFn?: (file: File) => Promise<string | null>; // 上传方法
    width?: string | number; // 宽度
    height?: string | number; // 高度
    modelValue?: string; // 地址
    fillBgUrl?: string; // 背景填充
    accept?: string; // 文件类型
  };

  const props = withDefaults(defineProps<Prop>(), {
    type: 'rect',
    // 文件上传方法
    uploadFn: async (file: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('files', file);
        const res = await fileUpload(formData);
        // 获取返回信息
        const { url } = res.data;
        console.log('url', url);
        return url;
      }
      return '';
    },
    width: '48px',
    height: '48px',
    accept: 'image/*',
  });

  const emit = defineEmits<{
    (e: 'callback', url: string): void;
    (e: 'update:modelValue', url: string): void;
  }>();

  let imgUrl = '';
  const defaultPhoto = computed({
    get() {
      // 当有填充图片的时候, 使用填充图片
      if (props.fillBgUrl && props.modelValue) {
        return props.fillBgUrl;
      }
      // 否则使用默认图片
      return props.modelValue;
    },
    set(value: any) {
      imgUrl = value;
      emit('callback', defaultPhoto.value);
      emit('update:modelValue', value);
    },
  });
  const fileInputDom = ref();

  // 上传照片
  const uploadPhoto = () => {
    // fileInputDom.value = ev.target?.closest('.upload-avatar')?.querySelector('.file_input_file')
    // fileInputDom.click()
    // console.log('fileInputDom', fileInputDom)
    fileInputDom.value.click();
  };

  // 上传文件请求
  const uploadFileRequest = async (file: File) => {
    // console.log('file', file)
    // console.log('file', file)
    const url = await props.uploadFn(file);
    // console.log('url', url)
    defaultPhoto.value = url || URL.createObjectURL(file);

    // 可以使用TUS进行文件上传操作
  };

  // 限制上传文件类型
  const uploadFileChange = (event: any) => {
    // 检查文件大小
    if (event.target.files[0].size / 1024 <= 32 * 1024) {
      const file = event.target.files[0];
      uploadFileRequest(file);
      // defaultPhoto.value = URL.createObjectURL(file)
      uploadFileRequest(file);
      fileInputDom.value.value = '';
    } else {
      fileOverSize();
    }
  };
</script>

<style lang="less" scoped>
  .upload-avatar {
    width: 48px;
    height: 48px;
    line-height: 48px;
    //font-size: 0;
    //background: #e2ebff;
    border: 2px dashed rgba(142, 146, 155, 0.6);
    //color: black;
    font-size: 30px;
    text-align: center;
    overflow: hidden;

    &.rect {
      border-radius: 4px;
    }

    &.circle {
      border-radius: 48px;
    }

    .avatar {
      width: 100%;
      height: 100%;

      .pic {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .bg-icon {
        i {
          color: #4886ff;
          font-size: 32px;
        }
      }

      .mask {
        width: 100%;
        height: 20px;
        background: rgba(0, 0, 0, 0.25);
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 20px;
        font-size: 0;

        i {
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
</style>
