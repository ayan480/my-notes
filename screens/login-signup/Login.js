import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the login validation schema
const loginSchema = yup.object().shape({
  emailOrPhone: yup.string()
    .required('Email or Mobile No. is required')
    .test('is-valid', 'Must be a valid email or phone number', value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Adjust according to your phone number format
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigation = useNavigation();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://192.168.29.98:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Save user ID and loggedIn status in AsyncStorage
        await AsyncStorage.setItem('userId', result.data.id);
        await AsyncStorage.setItem('loggedIn', 'true');

        // Clear input fields
        reset(); // Reset form fields

        // Navigate to Home screen
        navigation.navigate('Home');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/notes-logo.png')} style={styles.logo_style} />

      {/* Email or Phone Input */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="emailOrPhone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email or Mobile No."
              style={[styles.input, errors.emailOrPhone && styles.errorInput]} // Apply errorInput if error exists
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.emailOrPhone && <Text style={styles.errorMessage}>{errors.emailOrPhone.message}</Text>}
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword} // Toggle password visibility
                style={[styles.input, styles.passwordInput, errors.password && styles.errorInput]} // Apply errorInput if error exists
                onChangeText={onChange}
                value={value}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePassword}>
                  {showPassword ? 'Hide' : 'Show'} {/* Toggle text */}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && <Text style={styles.errorMessage}>{errors.password.message}</Text>}
      </View>

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.register}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  logo_style: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1, // Take available space in the row
  },
  errorInput: {
    borderColor: 'red', // Highlight border with red color when there's an error
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  togglePassword: {
    color: '#007bff',
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#007bff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  register: {
    marginTop: 20,
    color: '#007bff',
  },
});
