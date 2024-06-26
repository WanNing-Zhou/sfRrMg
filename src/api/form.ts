import axios from 'axios';

export interface BaseInfoModel {
  title: string; // 组件名称
  info: string; // 组件描述
  deploy: string; // 组件部署方式
  column: number; // 组件默认占列数
  row: number; // 组件默认占行数
  previewUrl: string; // 组件预览图片
  url: string; // 组件地址
  types?: string[]; // 组件标签
}
export interface ChannelInfoModel {
  advertisingSource: string;
  advertisingMedia: string;
  keyword: string[];
  pushNotify: boolean;
  advertisingContent: string;
}

export type UnitChannelModel = BaseInfoModel & ChannelInfoModel;

export function submitChannelForm(data: UnitChannelModel) {
  return axios.post('/api/channel-form/submit', { data });
}
