import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, BackHandler, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  // Function to fetch notes from the API
  const fetchNotes = async () => {
    if (!userId) return; // Prevent fetching if userId is not available

    try {
      const response = await fetch(`http://192.168.29.98:3000/notes/get-notes/${userId}`);
      const result = await response.json();

      if (result.success) {
        setNotes(result.data);
      } else {
        setError('Failed to fetch notes.');
      }
    } catch (err) {
      setError('Error fetching notes: ' + err.message);
    } finally {
      setLoading(false); // Ensure loading is set to false
      setRefreshing(false); // Stop refreshing if it was active
    }
  };

  // Fetch userId from AsyncStorage and then fetch notes
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id); // Store userId in state
          //console.log('userId:', id);
        } else {
          setError('No userId found.');
          setLoading(false); // Set loading to false if no userId
        }
      } catch (error) {
        //console.error('Failed to fetch userId:', error);
        setLoading(false); // Ensure loading is false on error
      }
    };

    getUserId();
  }, []);

  // Effect to fetch notes when userId changes
  useEffect(() => {
    fetchNotes(); // Call fetchNotes whenever userId is set
  }, [userId]);

  // Back button handling
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Function to handle refreshing
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId'); // Clear userId from AsyncStorage
      await AsyncStorage.removeItem('loggedIn'); // Clear loggedIn status
      navigation.navigate('Login'); // Navigate back to Login screen
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Render loading spinner or error if data hasn't been fetched
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8367C7" />
        <Text>Loading notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="skyblue" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={BackHandler.exitApp}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personal</Text>
        <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TouchableOpacity style={styles.newNoteCard}>
          <Text style={styles.newNoteText}>+</Text>
          <Text style={styles.newNoteLabel}>New note</Text>
        </TouchableOpacity>

        {notes.map((note) => (
          <View key={note._id} style={styles.noteCard}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
            <Text style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#8367C7',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchText: {
    color: '#8367C7',
    fontSize: 18,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  newNoteCard: {
    width: '48%',
    height: 150,
    backgroundColor: '#F1F2F3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  newNoteText: {
    fontSize: 32,
    color: '#8367C7',
  },
  newNoteLabel: {
    fontSize: 16,
    color: '#8367C7',
  },
  noteCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
