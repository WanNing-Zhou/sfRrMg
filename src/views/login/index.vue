<template>
  <div class="container">
    <div class="logo">
      <img
        width="33"
        height="33"

        alt="logo"
        :src="logoImg"
      />
      <div class="logo-text">可扩展式前端应用系统</div>
    </div>
    <LoginBanner />
    <div class="content">
      <div class="content-inner">
        <LoginForm v-if="!registerFromVisible" @register="registerCallback" />
        <RegisterForm v-if="registerFromVisible" />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Footer from '@/components/footer/index.vue';
  import RegisterForm from '@/views/login/components/register-form.vue';
  import logoImg from '@/assets/logo.png'
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';


  // 注册表单显示
  const registerFromVisible = ref(false);

  // 注册按钮点击回调
  const registerCallback = () => {
    registerFromVisible.value = true;
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
