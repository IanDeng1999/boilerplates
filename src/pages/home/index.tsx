import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("common.home")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("common.home")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="p-4">
          <p>{t("home.welcome")}</p>
          <IonButton expand="block" onClick={() => navigate("/login")}>
            {t("home.returnToLogin")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
