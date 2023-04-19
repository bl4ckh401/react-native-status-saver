import 'expo-dev-client';
import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    PermissionsAndroid,
    FlatList,
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { InterstitialAdManager, BannerView, NativeAdsManager } from 'react-native-fbads';
import { BannerId, interstitialId } from './variables/variables';
import { Settings } from 'react-native-fbsdk-next';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import RNFS from 'react-native-fs';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import Swiper from 'react-native-swiper'
import { StatusContext } from '../StatusProvider';

//rewardedVidId : 934748961301710_934751511301455
//interstitialId: 934748961301710_934749967968276
//bannerId : 934748961301710_934751307968142

const  width  = Dimensions.get('window').width;
const CARD_WIDTH = (width - 10) / 2;
const AD_HEIGHT = 100;

export default function Saved({ navigation }) {
    const [savedStatus, setSavedStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [statusData, setStatusData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [fullScreen, setFullScreen] = useState(null)

    const vw = value => (value / 100) * width;

    const hundredVw = {
        width: vw(100),
    };

    const {downloadStatus, setCounter} = useContext(StatusContext)
    

    const targetPath = `file:///${RNFS.DownloadDirectoryPath}/`;

    const getFiles = async () => {
        // get a list of files and directories in the main bundle

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await RNFS.readDir(targetPath).then((files) => {
                setSavedStatuses(files);

            })
        }
    }

    const userTracking = async () => {
        const { status } = await requestTrackingPermissionsAsync();

        Settings.initializeSDK();

        if (status === 'granted') {
            Settings.setAdvertiserTrackingEnabled(true);
        }

    }

    useEffect(() => {
        getFiles()
        console.log(savedStatus[0])
        userTracking()
    }, []);


    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        setModalVisible(true)
        setCounter(prevCounter => prevCounter + 1);
    };


    function renderItem({ item: status }) {
        if (!status.path.endsWith('.jpg') && !status.path.endsWith('.mp4')) {
            // Skip rendering if status is not an image or a video
            return null
        }
        return (
            <TouchableOpacity
                style={styles.statusContainer}
                onPress={() => {
                    handleStatusClick(status)
                }}
                key={status.name}
            >
                {status.path.includes('jpg') ? (
                    <Image style={styles.statusImage} source={{ uri: `file:///${status.path}` }} />
                ) : status.path.includes('mp4') ?
                    <Image style={styles.statusImage} source={{ uri: `file:///${status.path}` }} />
                    :null}
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#075e54' />
            <BannerView
                placementId={`${BannerId}`}
                type="standard"
                onPress={() => console.log('click')}
                onLoad={() => console.log('loaded')}
                onError={(err) => console.log('error', err)}
                style={{ width: '100%' }}

            />
            {modalVisible ?
            <>
                <Swiper
                    style={styles.selectedStatusContainer}
                    onPress={()=>{
                        setModalVisible(false); 
                    }}
                >
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.selectedStatusImage}>
                            {selectedStatus.path.endsWith('.jpg') ? (
                                <Image
                                    style={styles.selectedStatusImage}
                                    source={{ uri: `file:///${selectedStatus.path}` }}
                                />
                            ) : selectedStatus.path.endsWith('.mp4') ? (
                                <Video
                                    style={styles.selectedStatusImage}
                                    source={{ uri: `file:///${selectedStatus.path}` }}
                                    useNativeControls
                                    shouldPlay
                                />
                            ) : null}
                        </TouchableOpacity>
                </Swiper>
                <TouchableOpacity style={styles.downloadIconContainer}>
                <Icon
                    name="download"
                    type="font-awesome"
                    color="#fff"
                    size={25}
                    onPress={() => downloadStatus()}
                />
            </TouchableOpacity>
            </>
                :
                <FlatList
                    data={savedStatus}
                    keyExtractor={(status) => status.name}
                    renderItem={renderItem}
                    contentContainerStyle={[styles.statusList, hundredVw]}
                    numColumns={2}
                />
            }

            <BannerView
                placementId={`${BannerId}`}
                type="standard"
                onPress={() => console.log('click')}
                onLoad={() => console.log('loaded')}
                onError={(err) => console.log('error', err)}
                style={{ width: '100%' }}
            />
        </SafeAreaView>)
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adView: {
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
    },
    statusList: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: AD_HEIGHT,
        minHeight: '100%',
        flexGrow: 1,
        display: 'flex',
        // alignItems:'center'
    },
    statusContainer: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
    },
    statusImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        flexGrow: 1
    },
    statusVideoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    statusVideo: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
    },
    selectedStatusContainer: {
        width: '100%',
        minHeight: '70%'
    },
    selectedStatusImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        flexGrow: 1
    },
    bottomBorder: {
        height: 3,
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
    },
    statusVideoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusVideo: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
    },
    selectedStatusContainer: {
        width: '100%',
        minHeight: '70%'
    },
    selectedStatusImage: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        flexGrow: 1
    },
    downloadIconContainer: {
        position: 'absolute',
        bottom: AD_HEIGHT,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
});