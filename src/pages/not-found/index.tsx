import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>404</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.description")}</p>
        <IonButton routerLink="/tabbar/home">
          {t("notFound.returnHome")}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
