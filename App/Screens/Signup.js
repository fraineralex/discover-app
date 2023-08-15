import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import { darkMode as theme } from '../theme';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import LoginScreen from './Login';

export default function SignUpScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showSignIn, setShowSignIn] = useState(false);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCreateAccount = async () => {

        if (password === '' || email === '' || fullName === '') {
            Alert.alert('Please fill all the fields.');
            return;
        }

        if (password !== repeatPassword) {
            Alert.alert('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (fullName) {
                await updateProfile(user, {
                    displayName: fullName
                });

                console.log('User profile updated');
            }

            setShowSignIn(true);
        } catch (error) {
            const errorCode = error.code;
            Alert.alert(error.message.toString().replace('Firebase: ', ''));
            const errorMessage = error.message;
            console.log('Error creating account:', errorCode, errorMessage);
        }
    };

    const handleSignInPress = () => {
        setShowSignIn(true);
    };

    if(showSignIn) return <LoginScreen/>;

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <Text style={styles.logoText}>Create account</Text>
                        <TextInput
                            placeholder="Full name"
                            placeholderTextColor={theme.tabInactive}
                            style={styles.loginFormTextInput}
                            onChangeText={text => setFullName(text)}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={theme.tabInactive}
                            style={styles.loginFormTextInput}
                            onChangeText={text => setEmail(text)}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={theme.tabInactive}
                                style={styles.loginFormTextPassword}
                                secureTextEntry={!showPassword}
                                onChangeText={text => setPassword(text)}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesome
                                    name={!showPassword ? 'eye-slash' : 'eye'}
                                    size={20}
                                    color={theme.blue}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Repeat password"
                                placeholderTextColor={theme.tabInactive}
                                style={styles.loginFormTextPassword}
                                secureTextEntry={!showPassword}
                                onChangeText={text => setRepeatPassword(text)}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesome
                                    name={!showPassword ? 'eye-slash' : 'eye'}
                                    size={20}
                                    color={theme.blue}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleCreateAccount}
                        >
                            <Text style={styles.loginButtonText}>Sign up</Text>
                        </TouchableOpacity>
                        <View style={styles.footerView}>
                            <TouchableOpacity onPress={handleSignInPress}>
                                <Text style={styles.firstButtonText}>Do you have an account? <Text style={styles.secondButtonText}>Sign in.</Text></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        alignItems: "center",
        backgroundColor: theme.primary,
    },
    loginScreenContainer: {
        flex: 1,
        backgroundColor: theme.primary,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 150,
        marginBottom: 30,
        textAlign: "center",
        color: theme.headerText,
    },
    loginFormView: {
        flex: 1,
        padding: 5,
        paddingHorizontal: 20,
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.inputBorder,
        backgroundColor: theme.inputBackground,
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 8,
        marginLeft: 20,
        marginRight: 30,
        color: theme.secondary,
    },
    loginFormTextPassword: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.inputBorder,
        backgroundColor: theme.inputBackground,
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 8,
        width: 305,
        marginLeft: 20,
        color: theme.secondary,
    },
    loginButton: {
        backgroundColor: theme.blue,
        borderRadius: 10,
        height: 45,
        marginTop: 10,
        width: 350,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        paddingRight: 5,
    },
    fbLoginButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    loginButtonText: {
        fontSize: 18,
        color: theme.secondary,
    },
    forgotPasswordInput: {
        fontSize: 12,
        color: theme.blue,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 20,
        display: 'flex',
        alignSelf: 'flex-end',
        paddingRight: 30,
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        bottom: 0,
        borderTopColor: theme.inputBorder,
        borderTopWidth: 1,
    },
    firstButtonText: {
        marginTop: 20,
        marginBottom:10,
        fontSize: 16,
        color: theme.tabInactive,
    },
    secondButtonText: {
        fontSize: 16,
        color: theme.blue,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        width: 350,
    },
    showPasswordButton: {
        marginLeft: 10,
    },
});