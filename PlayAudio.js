import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider';

export default class App extends React.Component {
	state = {
		isPlaying: false,
		playbackInstance: null,
		volume: 1.0,
        isBuffering: true,
        position: 0,
        duration: 0
	}

	async componentDidMount() {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			shouldDuckAndroid: true,
			staysActiveInBackground: true,
			playThroughEarpieceAndroid: true
		})

		this.loadAudio()
	}

	async loadAudio() {
        try {
            const { isPlaying, volume } = this.state;
            const playbackInstance = new Audio.Sound();
            const source = { uri: this.props.uri };
            const status = { shouldPlay: isPlaying, volume: volume }
    
            playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
            await playbackInstance.loadAsync(source, status, false)
            this.setState({ playbackInstance })
        } catch (error) {
            console.log(error);
        }
	}

	onPlaybackStatusUpdate = status => {
        this.setState({
            isBuffering: status.isBuffering,
            position: parseInt(status.positionMillis / 1000),
            duration: parseInt(status.durationMillis / 1000)
        })
	}

	handlePlayPause = async () => {
		const { isPlaying, playbackInstance } = this.state;
		isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
		this.setState({ isPlaying: !isPlaying })
    }

    FormatSeconds = seconds => {
        var sec_num = parseInt(seconds, 10);
        var minutes = Math.floor(sec_num / 60);
        var seconds = sec_num - (minutes * 60);

        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds;
    }
    
    GetTimeStamp = () => {
        let position = this.FormatSeconds(parseInt(this.state.position));
        let durationMin = parseInt(this.state.duration / 60);
        let durationSec = parseInt(this.state.duration % 60);

        if (durationMin <= 9)
            durationMin = "0" + durationMin;
        if (durationSec <= 9)
            durationSec = "0" + durationSec;

        return <Text>{position} / {durationMin}:{durationSec}</Text>
    }

	render() {
		return (
            <>
            <TouchableOpacity style={ styles.container } onPress={this.handlePlayPause}>
                <View style={ styles.controls }>
                {this.state.isPlaying ? (
                    <Ionicons name='ios-pause' size={48} color='#444' />
                ) : (
                    <Ionicons name='ios-play-circle' size={48} color='#444' />
                )}
                {this.GetTimeStamp()}
                </View>
            </TouchableOpacity>
            {this.state.isPlaying ? 
            <Slider
                style={ styles.slider }
                minimumValue={0}
                maximumValue={this.state.duration ? this.state.duration : 0}
                minimumTrackTintColor="#009900"
                maximumTrackTintColor="#aaa"
                onValueChange={val => {
                    this.setState({ position: val });
                    this.state.playbackInstance.setPositionAsync(val * 1000);
                }}
                value={this.state.position}
            /> : null}
            </>
		)
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch"
    },
    slider: {
        flex: 1,
        marginTop: 20
    },
    controls: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});