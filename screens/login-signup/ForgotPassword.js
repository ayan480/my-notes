import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPassword() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const navigation = useNavigation();

  const onSubmit = data => {
    console.log(data); // Handle forgot password logic
    // Optionally, navigate back to login
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Email Input with dynamic styling based on error */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Email or Phone"
              style={[styles.input, errors.email && styles.errorInput]} // Apply errorInput if there's an error
              onChangeText={onChange}
              value={value}
            />
            {errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}
          </>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    marginBottom: 5,
  },
  errorInput: {
    borderColor: 'red', // Change border color to red when there's an error
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
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
  },
});
