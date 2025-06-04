import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

/**
 * Hook para exponer de forma sencilla si el dispositivo está conectado a Internet.
 *
 * Internamente se suscribe a NetInfo, que monitorea los cambios en el estado de la red.
 * Devuelve un único booleano `isConnected`, que será `true` si hay algún tipo de conexión,
 * o `false` si el dispositivo está completamente offline.
 */
export const useConnectivity = (): { isConnected: boolean } => {
  // Estado local que guardará si estamos o no conectados
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Suscribir a los cambios de estado de la conexión
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      // Cuando NetInfo notifique un cambio, actualizamos `isConnected`
      setIsConnected(state.isConnected === true);
    });

    // Al desmontar el hook, cancelar la suscripción
    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected };
};
