import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const signupSchema = yup.object().shape({
  firstName: yup.string().required('Firstame is required'),
  lastName: yup.string().required('Lastname is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().min(10, 'Phone must be 10 digits').required('Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

export default function Signup() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema)
  });

  const navigation = useNavigation();

  const onSubmit = data => {
    console.log(data); // Handle signup logic
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.main_container}>
    <View style={styles.container}>
      <Controller
        control={control}
        name="fisrtName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="First Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Phone"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

  
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main_container:{
    backgroundColor: '#f8f9fa',
  },
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
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginStart: 10,
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
  back: {
    marginTop: 20,
    color: '#007bff',
  },
});
