import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig.js';

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const { id, ...rest } = book; // Destructure id and the rest of the book data
  const [loading, setLoading] = useState(false);

  const borrowBook = async () => {
    setLoading(true);

    try {
      // Query to check if the book is already borrowed
      const borrowedQuery = query(
        collection(db, 'Books'),
        where('name', '==', book.name),
        where('status', '==', false) // status false means borrowed
      );
      const querySnapshot = await getDocs(borrowedQuery);

      if (!querySnapshot.empty) {
        Alert.alert('Already Borrowed', 'This book is already borrowed.');
        setLoading(false);
        return;
      }

      // Check if the user has already borrowed 3 books
      const allBorrowedBooks = await getDocs(collection(db, 'Books'));
      const borrowedBooksCount = allBorrowedBooks.docs.filter(doc => doc.data().status === false).length;

      if (borrowedBooksCount >= 3) {
        Alert.alert('Limit Reached', 'You cannot borrow more than 3 books.');
        setLoading(false);
        return;
      }

      // Update the book status to 'borrowed' (status = false)
      const bookRef = doc(db, 'Books', id); // Reference the correct book document using id
      await updateDoc(bookRef, { status: false });

      Alert.alert('Success', 'Book borrowed successfully.');
    } catch (error) {
      console.error('Error borrowing book:', error);
      Alert.alert('Error', 'Failed to borrow the book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: book.image || 'https://www.seekpng.com/png/detail/238-2389220_white-papers-default-book.png' }}
          style={styles.bookImage}
        />
        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        <Text style={styles.description}>{book.description || 'No description available.'}</Text>

        <TouchableOpacity
          style={styles.borrowButton}
          onPress={borrowBook}
          disabled={loading} // Disable if already borrowed
        >
          <Text style={styles.buttonText}>{loading ? 'Borrowing...' : 'Borrow Book'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('BorrowedBooks')}
        >
          <Text style={styles.secondaryButtonText}>Go to Borrowed Books</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, justifyContent: 'center' },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  bookImage: { width: 120, height: 180, borderRadius: 5, marginBottom: 15 },

  title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },

  author: { fontSize: 16, color: '#666', marginVertical: 5 },

  description: { fontSize: 14, color: '#444', marginVertical: 10, textAlign: 'center' },

  borrowButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },

  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  secondaryButton: {
    marginTop: 10,
    paddingVertical: 10,
  },

  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
});
