import { Message } from '@arco-design/web-vue';

/**
 * @description 文件过大提醒
 * @param size 文件最大size
 */
export const fileOverSize = (size: number | string | null = null) => {
  if (size) {
    Message.warning(`上传文件大小不能超过${size}`);
  } else {
    Message.warning('文件大小上传限制');
  }
};

/**
 * @description 文件类型错误提醒
 * @param suffix 文件后缀
 * @param wantType 文件类型
 */
export const fileTypeError = (suffix: string, wantType: string) => {
  if (suffix !== wantType) {
    Message.warning(`文件类型错误, 请选择${suffix}文件上传`);
  }
};
