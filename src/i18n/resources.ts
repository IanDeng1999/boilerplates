export const resources = {
  zh: {
    translation: {
      common: { home: "首页", user: "我的", back: "返回" },
      home: { welcome: "欢迎来到首页", returnToLogin: "返回登录页" },
      login: {
        title: "登录",
        phoneNumber: "手机号",
        phonePlaceholder: "请输入手机号",
        verificationCode: "验证码",
        verificationCodePlaceholder: "输入 6 位验证码",
        requestCode: "获取验证码",
        resendCode: "{{countdown}}s 后重发",
        submit: "登录 / 注册",
        agreement: "登录即表示你已阅读并同意服务协议与隐私政策",
        invalidPhone: "请输入正确的手机号",
        codeSent: "验证码已发送，请注意查收",
      },
      user: {
        title: "我的",
        appearance: "外观",
        darkMode: "深色模式",
        language: "语言",
        chinese: "中文",
        english: "English",
      },
      notFound: {
        title: "页面未找到",
        description: "您访问的页面不存在或已被移动。",
        returnHome: "返回首页",
      },
    },
  },
  en: {
    translation: {
      common: { home: "Home", user: "Profile", back: "Back" },
      home: {
        welcome: "Welcome to the home page",
        returnToLogin: "Return to login",
      },
      login: {
        title: "Sign in",
        phoneNumber: "Phone number",
        phonePlaceholder: "Enter your phone number",
        verificationCode: "Verification code",
        verificationCodePlaceholder: "Enter the 6-digit code",
        requestCode: "Get code",
        resendCode: "Resend in {{countdown}}s",
        submit: "Sign in / Register",
        agreement:
          "By signing in, you agree to the Terms of Service and Privacy Policy.",
        invalidPhone: "Enter a valid phone number",
        codeSent: "Verification code sent",
      },
      user: {
        title: "Profile",
        appearance: "Appearance",
        darkMode: "Dark mode",
        language: "Language",
        chinese: "Chinese",
        english: "English",
      },
      notFound: {
        title: "Page not found",
        description: "The page you requested does not exist or has moved.",
        returnHome: "Return home",
      },
    },
  },
} as const;
