import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  register as userRegister,
  getUserInfo,
  LoginData,
  setUserInfo,
  confirmPassword,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { RegisterData, ResetPasswordData } from '@/types/form';
import { Message, Modal } from '@arco-design/web-vue';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    mobile: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
    created_at: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    async updateInfo() {
      const infoForm: any | UserState = {
        id: this.id,
        name: this.name,
        introduction: this.introduction,
        mobile: this.mobile,
        email: this.email,
        avatar: this.avatar,
      };
      const res = await setUserInfo(infoForm);
      this.$patch(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async register(registerForm: RegisterData) {
      try {
        const res = await userRegister(registerForm);
        setToken(res.data.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
    //
    async resetPassword(resetPasswordForm: {
      oldPassword: string;
      newPassword: string;
    }) {
      const form: ResetPasswordData = {
        newPassword: resetPasswordForm.newPassword,
        oldPassword: resetPasswordForm.oldPassword,
        id: this.id,
      };
      try {
        await confirmPassword(form);
        Message.success({
          content: '修改成功',
        });
      } catch (err) {
        Message.error({ content: '修改失败' });
      }
    },
  },
});

export default useUserStore;
