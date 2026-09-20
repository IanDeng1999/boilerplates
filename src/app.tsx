import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, person } from "ionicons/icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import User from "./pages/user";
import { useAppStore } from "./stores/app";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
import "@ionic/react/css/palettes/dark.class.css";

setupIonicReact();

const App: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("ion-palette-dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/tabbar/*" element={<TabRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

const TabRoutes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabbar/home" element={<Home />} />
        <Route path="/tabbar/user" element={<User />} />
        <Route
          path="/tabbar"
          element={<Navigate to="/tabbar/home" replace />}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabbar/home">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>{t("common.home")}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="user" href="/tabbar/user">
          <IonIcon aria-hidden="true" icon={person} />
          <IonLabel>{t("common.user")}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default App;
