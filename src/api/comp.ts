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
  preview_url?: string; // 组件预览图片
  create_id?: string; // 创建人id
  created_at?: string; // 创建时间
  updated_at?: string; // 更新时间
  is_list?: number; // 组件状态
}

/**
 *  创建新组件
 * @param data
 */
export function createNewComp(data: CompInfoModel) {
  return axios.post('/api/comp/create', data);
}

type SearchComps = {
  name: string; // 组件名称 (模糊查询)
  createId: string; // 创建人id
  page: number; // 当前页
  pageSize: number; // 每页数量
};

/**
 * 获取组件列表
 * @param data
 */
export function getCompList(data: SearchComps) {
  return axios.get('/api/comp/list', { params: data });
}

/**
 * 获取组件详情
 * @param data
 */
export function getCompInfo(data: { id: string }) {
  return axios.get('/api/comp/info', { params: data });
}

/**
 * 更新组件信息
 * @param data
 */
export function updateComp(data: CompInfoModel) {
  return axios.post('/api/comp/update', data);
}