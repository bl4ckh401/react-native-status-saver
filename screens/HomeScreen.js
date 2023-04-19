import 'expo-dev-client';
import React, { useState, useEffect, useContext, memo } from 'react';
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
import { StatusContext } from '../StatusProvider';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';


//rewardedVidId : 934748961301710_934751511301455
//interstitialId: 934748961301710_934749967968276
//bannerId : 934748961301710_934751307968142

const width = Dimensions.get('window').width;
const CARD_WIDTH = (width - 10) / 2;
const AD_HEIGHT = 100;

export default function HomeScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [fullScreen, setFullScreen] = useState(null)

    const { statusList, setStatuses, selectedStatus, setSelectedStatus, statusData, setStatusData, setSelectedStatusIndex, selectedStatusIndex, currentImage, setCurrentImage, counterNav, setCounter, downloadStatus } = useContext(StatusContext)

    const statusesPath = `${RNFS.ExternalStorageDirectoryPath}/Whatsapp/Media/.statuses`;

    const windowWidth = Dimensions.get('window').width;
    const vw = value => (value / 100) * windowWidth;

    const hundredVw = {
        width: vw(100),
    };

    const getFiles = async () => {
        // get a list of files and directories in the main bundle

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await RNFS.readDir(statusesPath).then((files) => {
                setStatuses(files);

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
        userTracking()
    }, []);


    const handleStatusClick = ({status, index}) => {
        setSelectedStatus(status);
        setSelectedStatusIndex(index)
        setCurrentImage(index)
        setModalVisible(true)
    };


    const RenderItem = memo(({ status, onPress }) =>{
        if (!status.path.endsWith('.jpg') && !status.path.endsWith('.mp4')) {
            // Skip rendering if status is not an image or a video
            return null
        }
        return (
            <TouchableOpacity
                style={styles.statusContainer}
                onPress={() => {
                    setCounter(prevCounter => prevCounter + 1);
                    setSelectedStatus(status);
                    setCurrentImage(statusList[selectedStatusIndex])
                    setModalVisible(true)

                }}
                key={ status.name }
            >
                {status.path.endsWith('jpg') ? (
                    <Image style={styles.statusImage} source={{ uri: `file:///${status.path}` }} />
                ) : status.path.endsWith('mp4') ?
                    <Image style={styles.statusImage} source={{ uri: `file:///${status.path}` }} />
                    : (
                        <>
                        </>
                    )}
            </TouchableOpacity>
        )
    })

    return (
        <SafeAreaView style={styles.container}>
            <BannerView
                placementId={`${BannerId}`}
                type="standard"
                onPress={() => console.log('click')}
                onError={(err) => console.log('error', err)}
                style={{ width: '100%' }}

            />
            {modalVisible ?
                <>
                    <Swiper
                        style={styles.selectedStatusContainer}
                        index={currentImage}  // Set the initial index to currentImage
                        onPress={() => {
                            setModalVisible(false);
                        }}
                        onIndexChanged={(index) => {
                            setSelectedStatus(statusList[index])
                        }}
                        showsButtons
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
                    data={statusList}
                    keyExtractor={(status) => status.name}
                    renderItem={({ item, index }) => (<RenderItem status={item} />)}
                    contentContainerStyle={[styles.statusList, hundredVw]}
                    numColumns={2}
                />
            }
            <BannerView
                placementId={`${BannerId}`}
                type="standard"
                onPress={() => console.log('click')}
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