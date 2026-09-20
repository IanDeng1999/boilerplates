import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { callOutline, keyOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { phonePattern, verificationCodeCountdown } from "./const";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      setMessage(t("login.invalidPhone"));
      return;
    }

    setCountdown(verificationCodeCountdown);
    setMessage(t("login.codeSent"));
  };

  const submit = () => {
    navigate("/tabbar/home", { replace: true });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabbar/home" text={t("common.back")} />
          </IonButtons>
          <IonTitle>{t("login.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <IonList lines="none">
              <IonItem className="mb-4">
                <IonIcon aria-hidden="true" icon={callOutline} slot="start" />
                <IonInput
                  id="phone-number"
                  inputMode="numeric"
                  label={t("login.phoneNumber")}
                  labelPlacement="stacked"
                  maxlength={11}
                  placeholder={t("login.phonePlaceholder")}
                  type="tel"
                  value={phoneNumber}
                  onIonInput={(event) =>
                    setPhoneNumber(event.detail.value?.replace(/\D/g, "") ?? "")
                  }
                />
              </IonItem>
              <IonItem className="mb-4">
                <IonIcon aria-hidden="true" icon={keyOutline} slot="start" />
                <IonInput
                  id="verification-code"
                  inputMode="numeric"
                  label={t("login.verificationCode")}
                  labelPlacement="stacked"
                  maxlength={6}
                  placeholder={t("login.verificationCodePlaceholder")}
                  value={verificationCode}
                  onIonInput={(event) =>
                    setVerificationCode(
                      event.detail.value?.replace(/\D/g, "") ?? "",
                    )
                  }
                />
                <IonButton
                  disabled={countdown > 0}
                  fill="clear"
                  onClick={requestCode}
                  slot="end"
                  type="button"
                  size="default"
                >
                  {countdown > 0
                    ? t("login.resendCode", { countdown })
                    : t("login.requestCode")}
                </IonButton>
              </IonItem>
              <IonItem lines="none" className="mb-3">
                <div className="w-full">
                  <IonButton expand="block" type="submit" size="default">
                    {t("login.submit")}
                  </IonButton>
                </div>
              </IonItem>
              <IonItem lines="none">
                <IonNote color="medium" className="text-center">
                  {t("login.agreement")}
                </IonNote>
              </IonItem>
            </IonList>
          </form>
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
