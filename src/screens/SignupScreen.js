import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { colors } from "../../src/constants";


export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null)
    const [showNext, setShowNext] = useState(false)
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />
    }
    const userSignup = async () => {
        if (!email || !password || !image || !name) {
            alert("please add all the field")
            return
        }
        setLoading(true)
        try {
            const result = await auth().createUserWithEmailAndPassword(email, password)
            firestore().collection('users').doc(result.user.uid).set({
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                pic: image,
                status: "online"
            })
            setLoading(false)
        } catch (err) {
            
           // console.log(err);
            alert("something went wrong during Signup")
            setLoading(false)
        }


    }
    const pickImageAndUpload = () => {
        launchImageLibrary({ quality: 1 }, (result) => {
            // console.log(image);

            const img = result.assets[0];
            const uploadTask = storage()
                .ref()
                .child(`/userprofile/${Date.now()}`)
                .putFile(img.uri);


            uploadTask.on('state_changed',
                (snapshot) => {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progress == 100) alert('image uploaded')
                },
                (error) => {
                    alert("error uploading image")
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setImage(downloadURL)
                    });
                }
            );
        })
    }

    return (
        <KeyboardAvoidingView behavior="position">
            <View style={styles.box1}>
                <Text style={styles.text}>Welcome to KhapShap</Text>
                <Image style={styles.img} source={require('../assets/wa.png')} />
            </View>
            <View style={styles.box2}>
                {!showNext &&
                    <>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            mode="outlined"
                        />
                        <TextInput
                            label="password"
                            mode="outlined"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    </>
                }

                {showNext ?
                    <>
                        <TextInput
                            label="Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                            mode="outlined"
                        />
                        <Button
                            mode="contained"
                            onPress={() => pickImageAndUpload()}
                        >select profile pic</Button>
                        <Button
                            mode="contained"
                            disabled={image ? false : true}
                            onPress={() => userSignup()}
                        >Signup</Button>
                    </>
                    :
                    <Button
                        mode="contained"
                        disabled={ password? false : true}
                        onPress={() => setShowNext(true)}
                    >Next</Button>
                }

                <TouchableOpacity onPress={() => navigation.navigate('login')}><Text style={{ textAlign: "center" }}>Already have an account ?</Text></TouchableOpacity>
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