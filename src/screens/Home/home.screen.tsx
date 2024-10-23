import { Dimensions, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
	topView:{
		alignItems: 'center',
		backgroundColor:'black',
		height:height*.5,
		display:'flex',
		justifyContent:'center'
	},
	title: {
		fontWeight:200,
		color:'red',
		fontSize:30
	}
})

const Home = () => {
	return (
		<SafeAreaView>
			<View style={[styles.topView]}>

			<Text style={[styles.title]}>Contacts</Text>
			</View>
		</SafeAreaView>
	)
}

export default Home
