import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const NotFound: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>404</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>页面未找到</h1>
        <p>您访问的页面不存在或已被移动。</p>
        <IonButton routerLink="/tabbar/home">返回首页</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
