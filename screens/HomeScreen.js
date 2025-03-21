import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, 'Books'));
      const bookList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(bookList);
      setLoading(false);
    };  

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Fetching books...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
          >
            <Image source={{ uri: item.image || 'https://www.seekpng.com/png/detail/238-2389220_white-papers-default-book.png' }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.author}>{item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 15, paddingTop: 10 },
  
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, fontSize: 16, color: '#555' },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  
  bookImage: { width: 60, height: 90, borderRadius: 5, marginRight: 15 },
  
  bookInfo: { flex: 1, justifyContent: 'center' },
  
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  author: { fontSize: 14, color: '#666', marginTop: 5 },
});

