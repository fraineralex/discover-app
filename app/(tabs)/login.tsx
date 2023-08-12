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
} from "react-native";
import { darkMode as theme } from '../theme';
import { FontAwesome } from '@expo/vector-icons';

export default function login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLoginPress = () => {

  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Discover</Text>
            <TextInput
              placeholder="Username"
              style={styles.loginFormTextInput}
              onChangeText={text => setUsername(text)}
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
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color={theme.blue}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.forgotPasswordInput}>Forgot password?</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => onLoginPress()}
            >
              <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
              <Text style={styles.firstButtonText}>Don't have an account? <Text style={styles.secondButtonText}>Sign up.</Text></Text>
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
    marginLeft: 20
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
