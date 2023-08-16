import React, { useState, useContext } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { darkMode as theme } from '../theme';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import { UserContext } from '../Context/UserContext';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userContext = useContext(UserContext);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleSignIn = () => {
        if (email === '') {
            Alert.alert('Please enter an email');
            return;
        }

        if (password === '') {
            Alert.alert('Please enter a password');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const currentUser = userCredential.user;
                currentUser.getIdToken().then(async (token) => {
                    await SecureStore.deleteItemAsync("token");
                    await SecureStore.deleteItemAsync("user");
                    await SecureStore.setItemAsync("token", token);
                    await SecureStore.setItemAsync("user", JSON.stringify(currentUser));
                    console.log(currentUser)
                    userContext.setUser(currentUser)
                });
            })
            .catch((error) => {
                Alert.alert(error.message.toString().replace('Firebase: ', ''));
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Error signed in:', errorCode, errorMessage);
            }
            );
    };

    const handleSignUpPress = () => {
        navigation.navigate('Signup')
    };

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <Text style={styles.logoText}>Discover</Text>
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
                                    name={showPassword ? 'eye-slash' : 'eye'}
                                    size={20}
                                    color={theme.blue}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.forgotPasswordInput}>Forgot password?</Text>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleSignIn}
                        >
                            <Text style={styles.loginButtonText}>Sign in</Text>
                        </TouchableOpacity>
                        <View style={styles.footerView}>
                            <TouchableOpacity onPress={handleSignUpPress}>
                                <Text style={styles.firstButtonText}>Don't have an account? <Text style={styles.secondButtonText}>Sign up.</Text></Text>
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
        color: theme.secondary,
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
        color: theme.primary,
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
        marginBottom: 10,
        fontSize: 16,
        color: theme.secondary,
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

