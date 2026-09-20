import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { phonePattern, verificationCodeCountdown } from "./const";
import "./login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (countdown === 0) {
      return;
    }

    const timer = window.setTimeout(
      () => setCountdown((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const requestCode = () => {
    if (!phonePattern.test(phoneNumber)) {
      setMessage("请输入正确的手机号");
      return;
    }

    setCountdown(verificationCodeCountdown);
    setMessage("验证码已发送，请注意查收");
  };

  const submit = () => {
    navigate("/tabbar/home", { replace: true });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbar/home" text="返回" />
          </IonButtons>
          <IonTitle>登录</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
        <main className="login-page">
          <section className="login-panel">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <IonInput
                id="phone-number"
                inputMode="numeric"
                label="手机号"
                maxlength={11}
                placeholder="请输入手机号"
                type="tel"
                value={phoneNumber}
                onIonInput={(event) =>
                  setPhoneNumber(event.detail.value?.replace(/\D/g, "") ?? "")
                }
              />
              <div className="verification-field">
                <IonInput
                  id="verification-code"
                  inputMode="numeric"
                  label="验证码"
                  maxlength={6}
                  placeholder="输入 6 位验证码"
                  value={verificationCode}
                  onIonInput={(event) =>
                    setVerificationCode(
                      event.detail.value?.replace(/\D/g, "") ?? "",
                    )
                  }
                />
                <button
                  className="code-button"
                  disabled={countdown > 0}
                  onClick={requestCode}
                  type="button"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
                </button>
              </div>

              <IonButton className="login-button" expand="block" type="submit">
                登录 / 注册
              </IonButton>
            </form>

            <IonLabel className="security-note" color="medium">
              登录即表示你已阅读并同意服务协议与隐私政策
            </IonLabel>
          </section>
        </main>
        <IonToast
          isOpen={Boolean(message)}
          message={message}
          duration={1800}
          position="top"
          onDidDismiss={() => setMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
