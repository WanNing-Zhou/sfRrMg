import axios from 'axios';

export interface CompInfoModel {
  title: string; // 组件名称
  info: string; // 组件描述
  deploy: string; // 组件部署方式
  column: number; // 组件默认占列数
  row: number; // 组件默认占行数
  previewUrl: string; // 组件预览图片
  url: string; // 组件地址
  types?: string[]; // 组件标签
}

/**
 *  创建新组件
 * @param data
 */
export function createNewComp(data: CompInfoModel) {
  return axios.post('/api/comp', { data });
}
