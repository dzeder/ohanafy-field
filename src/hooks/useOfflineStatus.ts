import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface OfflineStatus {
  isOffline: boolean;
  type: string;
  isInternetReachable: boolean | null;
}

export function useOfflineStatus(): OfflineStatus {
  const [status, setStatus] = useState<OfflineStatus>({
    isOffline: false,
    type: 'unknown',
    isInternetReachable: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isOffline: !state.isConnected || state.isInternetReachable === false,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    NetInfo.fetch().then((state) => {
      setStatus({
        isOffline: !state.isConnected || state.isInternetReachable === false,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
}
