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
import { moonOutline } from "ionicons/icons";
import { useAppStore } from "../../stores/app";

const User: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setDarkMode = useAppStore((state) => state.setDarkMode);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">User</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonListHeader>外观</IonListHeader>
          <IonList inset>
            <IonItem>
              <IonIcon aria-hidden="true" icon={moonOutline} slot="start" />
              <IonToggle
                checked={isDarkMode}
                justify="space-between"
                onIonChange={(event) => setDarkMode(event.detail.checked)}
              >
                深色模式
              </IonToggle>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default User;
