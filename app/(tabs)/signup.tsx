import React, { useState } from 'react';
import router from '../utils';
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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleCreateAccount = () => {
    password === '' ? Alert.alert('Please enter a password') : '';
    email === '' ? Alert.alert('Please enter an email') : '';
    password !== repeatPassword ? Alert.alert('Passwords do not match') : '';
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User account created', user);
        router.replace('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        Alert.alert(error.message.toString().replace('Firebase: ', ''));
        const errorMessage = error.message;
        console.log('Error creating account:', errorCode, errorMessage);
      }
      )
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Create account</Text>
            <TextInput
              placeholder="Email"
              style={styles.loginFormTextInput}
              onChangeText={text => setEmail(text)}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
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
              <Text style={styles.firstButtonText}>You have an account? <Link style={styles.secondButtonText} href="/login">Sign in.</Link></Text>
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
    placeholderTextColor: theme.tabInactive,
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
    placeholderTextColor: theme.tabInactive,
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
    top: 290,
    borderTopColor: theme.inputBorder,
    borderTopWidth: 1,
  },
  firstButtonText: {
    marginTop: 20,
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
