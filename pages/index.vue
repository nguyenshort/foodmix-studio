<template>
  <div class="login-container">
    <div
      class="login-bg"
      style="background-image: url(https://static3w.kuaikanmanhua.com/static-kk-ecology/img/login_bg.8a7b128.jpg);"
    />
    <div class="login-inner">
      <div class="login-form">
        <a-form-model
          ref="formRule"
          class="form"
          layout="vertical"
          :model="form"
          :rules="rules"
        >
          <div class="form-title">
            <img src="/favicon/favicon-96x96.png"  alt="" width="40" />
            <p>FoodMix</p>
          </div>
          <a-form-model-item ref="email" prop="email" has-feedback>
            <a-input
              v-model="form.email"
              placeholder="Tên đăng nhập"
              @blur="$refs.email.onFieldBlur()"
            />
          </a-form-model-item>
          <a-form-model-item ref="password" prop="password" has-feedback style="margin-bottom: 12">
            <a-input-password
              v-model="form.password"
              placeholder="Mật khẩu"
              @blur="$refs.password.onFieldBlur()"
            />
            <template slot="extra">
              <small>
                TK: demo@foodmix.xyz | MK: 123456
              </small>
            </template>
          </a-form-model-item>
          <a-button
            type="primary"
            :icon="isLoading ? 'loading' : 'caret-right'"
            :disabled="isLoading"
            @click="submitForm()"
          >
            Đăng Nhập
          </a-button>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoginPage',
  layout: 'blank',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      isLoading: false,
      rules: {
        email: [
          {
            required: true,
            message: 'Email không được để trống',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Địa chỉ Email không hợp lệ',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Mật khẩu không được để trống'
          }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          this.loginAction()
        }
      })
    },
    async loginAction () {
      this.isLoading = true
      try {
        const { data } = await this.$axios.$post('/users/sign-in',this.form)
        this.$nuxt.$emit('loginModal')
        await this.$cookies.set('_token', data)

        setTimeout(()=> {
          location.reload()
        }, 1500)

        // get user

      } catch (e) {}
      this.isLoading = false
    }
  }
}
</script>

<style>
.login-container {
  position: relative;
  width: 100%;
}
.login-container .login-bg {
  position: fixed;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  z-index: -1;
}
.login-inner {
  height: 100vh;
  display: flex;
}
.login-form {
  width: 366px;
  padding: 30px 40px 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 6%);
  border-radius: 4px;
  margin: auto;
}

.login-form .ant-form-explain {
  font-size: 12px;
}
.form-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}
.form-title p {
  margin-bottom: 0;
  margin-left: 10px;
  font-size: 20px;
  font-weight: 500;
  color: #3b66f4;
}
</style>
