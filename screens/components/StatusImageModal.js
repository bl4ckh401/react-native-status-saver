import React, { useContext, useEffect } from 'react';
import { StyleSheet, Modal, Image, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper'
import { StatusContext } from '../../StatusProvider';
import { Video } from 'expo-av';
import { stat } from 'react-native-fs';

const width = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const vh = value => (value / 100) * windowHeight;
const CARD_WIDTH = (width - 10) / 2;
const AD_HEIGHT = 100;
const hundredVh = {
    width: vh(100),
};

const StatusImageModal = ({navigation}) => {
    const { statusList, setStatuses, selectedStatus, setSelectedStatus, statusData, setStatusData, selectedStatusIndex, setSelectedStatusIndex, currentImage, setCurrentImage, downloadStatus, counterNav, setCounter, showInterstitial } = useContext(StatusContext)


    const handleStatusClick = (status) => {
        console.log(selectedStatusIndex)
        setSelectedStatus(status);
        navigation.navigate('StatusImageModal')
    };

    useEffect(() => {
        setCounter(prevCounter => prevCounter + 1);
        if ((counterNav) % 2 === 0) {
            showInterstitial();
        }
        console.log('Counter', counterNav);
    }, []);

    return (
        <>
        <View style={styles.header}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text style={styles.headerText}>Status Saver</Text>
                </View>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => {
                            console.log('Statuses pressed')
                            navigation.navigate('HomeScreen')
                        
                        }}>
                        <Text style={[styles.sectionText, { color: '#fff' }]}>Statuses</Text>
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => {
                            console.log('Saved pressed')
                            navigation.navigate('Saved')
                        }}>
                        <Text style={styles.sectionText}>Saved</Text>
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => console.log('Gallery pressed')}>
                        <Text style={styles.sectionText}>Gallery</Text>
                        <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                </View>
            </View>
            <Swiper
                style={styles.selectedStatusContainer}
                onIndexChanged={(index) => {
                    setSelectedStatusIndex(prevIndex => prevIndex + 1)
                    handleStatusClick(statusList[selectedStatusIndex+1])
                    setCurrentImage(currentImage+1)
                    console.log(selectedStatus)
                }}
                showsButtons
                showsPagination={false}
            >
                    {statusList.map((status)=>{
                        return(
                            <>
                                {
                                    statusList[selectedStatusIndex].path.endsWith('.jpg') ? (
                                        <Image
                                            style={styles.selectedStatusImage}
                                            source={{ uri: `file:///${statusList[selectedStatusIndex].path}` }}
                                            key={statusList[selectedStatusIndex].name}
                                        />
                                    ) : statusList[selectedStatusIndex].path.endsWith('.mp4') ? (
                                        <Video
                                            style={[styles.selectedStatusImage, hundredVh]}
                                            source={{ uri: `file:///${statusList[selectedStatusIndex].path}` }}
                                            useNativeControls
                                            key={statusList[selectedStatusIndex].name}
                                        />
                                    ) : null
                                }
                            </>
                        )
                    })}
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
    );
};

const styles = StyleSheet.create({
    statusImage: {
        flex: 1,
        resizeMode: 'contain',
    },
    header: {
        paddingVertical: 10,
        marginTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#075e54',
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%'
    },
    topIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120,
    },
    headerText: {
        fontSize: 20,
        color: '#fff',
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20
    },
    sectionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    sectionText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.6)',
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
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
});

export default StatusImageModal;
