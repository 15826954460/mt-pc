<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"/>
        <span class="login">
          <em class="bold">已有美团账号?</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"/>
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
          <span class="red">{{limitmsg}}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4"/>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import CryptoJs from "crypto-js";
import { setTimeout, clearTimeout } from "timers";
const axios = require("../server/interface/utils/axios");
export default {
  layout: "blank",
  data() {
    return {
      timerid: null, // 判断定时器是否结束
      statusMsg: "",
      limitmsg: "",
      error: "",
      ruleForm: {
        name: "",
        code: "",
        pwd: "",
        cpwd: "",
        email: ""
      },
      rules: {
        name: [
          {
            required: true,
            type: "string",
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "创建密码",
            trigger: "blur"
          }
        ],
        cpwd: [
          {
            required: true,
            message: "确认密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.pwd) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 发送验证码
    sendMsg() {
      let namePass, emailPass;
      if (this.timerid) return;
      this.$refs["ruleForm"].validateField("name", valid => {
        namePass = valid;
      });
      this.statusMsg = "";
      // 如果用户名都没有校验成功，就不在进行下面的校验
      if (namePass) return;

      this.$refs["ruleForm"].validateField("email", valid => {
        emailPass = valid;
      });
      if (!namePass && !emailPass) {
        axios
          .post("/users/verify", {
            username: encodeURIComponent(this.ruleForm.name), // 中文进行编码
            email: this.ruleForm.email
          })
          .then(({ status, data }) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60;
              this.statusMsg = `验证码已发送，剩余${count--}秒`;
              this.timerid = setInterval(() => {
                this.statusMsg = `验证码已发送，剩余${count--}秒`;
                if (count === 0) {
                  clearInterval(this.timerid);
                  this.timerid = null;
                  this.statusMsg = "";
                }
              }, 1000);
            } else if (data.code === -1) {
              clearInterval(this.timerid);
              this.statusMsg = data.msg;
            } else if (data.code === -2) {
              this.limitmsg = data.limitmsg;
              let _timer = setTimeout(() => {
                this.limitmsg = "";
                clearTimeout(_timer);
                _timer = null;
              }, 1000);
            }
          });
      }
    },
    // 同意注册协议
    register() {
      let self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios
            .post("/users/signup", {
              // 用户名进行编码
              username: window.encodeURIComponent(self.ruleForm.name),
              // 使用MD5加密
              password: CryptoJs.MD5(self.ruleForm.pwd).toString(),
              email: self.ruleForm.email,
              code: self.ruleForm.code
            })
            .then(({ status, data }) => {
              // http 的请求返回的成功
              if (status === 200) {
                // 接口返回的成功处理的状态码
                if (data && data.code === 0) {
                  location.href = "/login";
                } else {
                  // 显示错误提示信息
                  self.error = data.msg;
                }
              } else {
                self.error = `服务器出错，错误码:${status}`;
              }
              // 一段时间之后自动清空提示内容，防止用户修改之后再次输入时，错误提示仍然存在的bug
              let _timer = setTimeout(() => {
                clearTimeout(_timer);
                _timer = null;
                self.error = "";
              }, 1500);
            });
        }
      });
    }
  }
};

// const ctx = {
//   request: {
//     method: "POST",
//     url: "/users/signin",
//     header: {
//       host: "localhost:3000",
//       "user-agent": "curl/7.54.0",
//       accept: "*/*",
//       "content-length": "0",
//       "content-type": "application/x-www-form-urlencoded"
//     }
//   },
//   response: {
//     status: 404,
//     message: "Not Found",
//     header: "[Object: null prototype] {}"
//   },
//   app: { subdomainOffset: 2, proxy: true, env: "development" },
//   originalUrl: "/users/signin",
//   req: "<original node req>",
//   res: "<original node res>",
//   socket: "<original node socket>"
// };

</script>
<style lang="scss">
@import "@/assets/css/register/index.scss";
.red {
  color: red;
}
</style>
