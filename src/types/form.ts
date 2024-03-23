// 这里用来存放各种表单的类型

// 用户注册
export type Register = {
  email: string;
  name: string;
  password: string;
}

// 用户登陆
export type Login = {
  email: string;
  password: string;
}
