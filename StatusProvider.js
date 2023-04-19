import React, { createContext, useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native';
export const StatusContext = createContext({});
import RNFS from 'react-native-fs';
import { InterstitialAdManager, BannerView, NativeAdsManager } from 'react-native-fbads';
import { BannerId, interstitialId } from './screens/variables/variables';
import { Settings } from 'react-native-fbsdk-next';

const StatusProvider = ({ children }) => {

    const [statusList, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [statusData, setStatusData] = useState([]);
    const [selectedStatusIndex, setSelectedStatusIndex] = useState(null);
    const [currentImage, setCurrentImage] = useState(0)
    const [counterNav, setCounter] = useState(0);
    const downloadStatus = async () => {

        const statusesPath = `file:///${selectedStatus.path}`;

        const targetPath = `file:///${RNFS.DownloadDirectoryPath}/${selectedStatus.name}`;
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (targetPath.exists) {
                await RNFS.copyFile(statusesPath, targetPath)
            } else {
                // targetPath = await RNFS.mkdir(`file:///${RNFS.ExternalDirectoryPath}/Saved/`)
                await RNFS.copyFile(statusesPath, targetPath)
            }
        }
    };

    const showInterstitial = () => {
        InterstitialAdManager.showAd(`${interstitialId}`)
            .then((didClick) => {  })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        if ((counterNav) % 5 === 0) {
            showInterstitial();
        }
    }, [counterNav]);


    return (
        <StatusContext.Provider value={{
            statusList, setStatuses,
            selectedStatus, setSelectedStatus,
            statusData, setStatusData,
            selectedStatusIndex, setSelectedStatusIndex,
            currentImage, setCurrentImage,
            downloadStatus,
            counterNav, setCounter, showInterstitial
        }}>
            {children}
        </StatusContext.Provider>
    )
}

export default StatusProvider