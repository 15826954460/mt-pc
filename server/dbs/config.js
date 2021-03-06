const Email = {
  // 连接本地数据库 student
  dbs: "mongodb://127.0.0.1:27017/student",
  redis: {
    // 设置ip
    get host() {
      return "127.0.0.1"; // 设置redis默认的域名
    },
    // 设置端口号
    get port() {
      return 6379; // redis 默认端口
    }
  },
  // smtp 服务权限校验
  smtp: {
    get host() {
      return "smtp.qq.com";
    },
    // 获取qq邮箱授权
    get user() {
      return "624793604@qq.com";
    },
    get pass() {
      return "ipsfsffuqvxvbahj"; // 发送邮件的qq授权码
    },
    // 生成随机验证码
    get code() {
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toUpperCase();
      };
    },
    // 设置60秒有效时间
    get expire() {
      return () => {
        return parseInt(new Date().getTime()) + 60 * 1000 * 3; // 这里将时间设置成3分钟，方便调试，实际开发中根据实际情况进行设置
      };
    }
  },
  sign: "a3c9fe0782107295ee9f1709edd15218",
  requestUrl: "http://cp-tools.cn" // http://cp-tools.cn/geo/menu?sign=a3c9fe0782107295ee9f1709edd15218
};
module.exports = Email;
// 624793604@qq.com
