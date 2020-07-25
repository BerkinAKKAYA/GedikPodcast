import React from 'react';
import {
    ImageBackground, Image, StyleSheet, Text, View, ScrollView
} from 'react-native';
import PlayAudio from './PlayAudio';

const podcasts = require('./assets/podcasts.json');

function WelcomeScreen() {
    const BackgroundImage = "./assets/brick.png";

    return (
        <ImageBackground
            style={{ flex: 1, alignItems: "center" }}
            source={ require(BackgroundImage) }
            resizeMode="repeat"
        >
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Gedik Podcast</Text>
            </View>

                <ScrollView
                    style={{ width: "90%" }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
                >
                {Object.keys(podcasts).map(podcast => {
                    return (
                        <View style={styles.podcastContainer} key={podcast}>
                            <Image
                                source={{uri: 'https://radyogedik.com.tr/wp-content/uploads/2019/02/mic.jpg' }}
                                style={ styles.image }/>
                            <View style={{ padding: 30 }}>
                                <Text style={styles.podcastHeader}>{podcast}</Text>
                                <PlayAudio uri={podcasts[podcast]} />
                            </View>
                        </View>
                    );
                })}
                </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "white",
        padding: 25,
        opacity: .9,
        width: "100%",
        marginBottom: 15
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
    },
    podcastContainer: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 15,shadowColor: "#000",

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 8,
    },
    podcastHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    image: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})

export default WelcomeScreen;