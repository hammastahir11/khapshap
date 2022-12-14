import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />
    }
    const userLogin = async () => {
        if (!email || !password) {
            alert("please add all the field")
            return
        }
        setLoading(true)
        try {
            const result = await auth().signInWithEmailAndPassword(email, password)
            setLoading(false)
        } catch (err) {
            alert("Email or Password doesn't match")
            setLoading(false)
            
        }

    }
    return (

        <KeyboardAvoidingView behavior="position">

            <View style={styles.box1}>
                <Text style={styles.text}>Welcome to KhapShap</Text>
                <Image style={styles.img} source={require('../assets/wa.png')} />
            </View>
            <View style={styles.box2}>

                <TextInput
                    label="Email"
                    mode="outlined"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    label="password"
                    mode="outlined"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <Button
                    mode="contained"
                    onPress={() => userLogin()}
                >Login</Button>
                <TouchableOpacity onPress={() => navigation.navigate('signup')}><Text style={{ textAlign: "center" }}>Dont have an account ?</Text></TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        color: "green",
        margin: 10
    },
    img: {
        width: 200,
        height: 200
    },
    box1: {
        alignItems: "center"
    },
    box2: {
        paddingHorizontal: 40,
        justifyContent: "space-evenly",
        height: "50%"
    }
});