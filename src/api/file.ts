import axios from "axios";

export function fileUpload(formData: any) {
  return axios(import.meta.env.VITE_API_UPLOAD_URL,{
    method: 'post',
    transformRequest: [
      function (data) {
        // 去除post请求默认的Content-Type
        // delete headers.post['Content-Type']
        return data;
      },
    ],
    data: formData,
  });
}

export function compUpload(formData: any){
  return ''
}