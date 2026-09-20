import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { languageOutline, moonOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/app";

const User: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setDarkMode = useAppStore((state) => state.setDarkMode);
  const { i18n, t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("user.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("user.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonListHeader>{t("user.appearance")}</IonListHeader>
          <IonList inset>
            <IonItem>
              <IonIcon aria-hidden="true" icon={moonOutline} slot="start" />
              <IonToggle
                checked={isDarkMode}
                justify="space-between"
                onIonChange={(event) => setDarkMode(event.detail.checked)}
              >
                {t("user.darkMode")}
              </IonToggle>
            </IonItem>
            <IonItem>
              <IonIcon aria-hidden="true" icon={languageOutline} slot="start" />
              <IonToggle
                checked={i18n.resolvedLanguage === "en"}
                justify="space-between"
                onIonChange={(event) =>
                  i18n.changeLanguage(event.detail.checked ? "en" : "zh")
                }
              >
                {t("user.english")}
              </IonToggle>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default User;
