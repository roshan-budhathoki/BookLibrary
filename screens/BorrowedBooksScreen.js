import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Animated, StyleSheet } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { Card, Button } from 'react-native-paper';

export default function BorrowedBooksScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const allBorrowedBooks = await getDocs(collection(db, 'Books'));
        const borrowedBooks = allBorrowedBooks.docs
              .filter(doc => doc.data().status === false)
              .map(doc => ({ id: doc.id, ...doc.data() }));
        setBorrowedBooks(borrowedBooks);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const returnBook = async (id) => {
    try {
      const bookRef = doc(db, 'Books', id);
      await updateDoc(bookRef, { status: true });

      // Update state for UI update
      setBorrowedBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === id ? { ...book, status: true } : book
        )
      );
    } catch (error) {
      console.error('Error updating book status:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Borrowed Books</Text>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.emptyText}>No books borrowed yet.</Text>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <FlatList
            data={borrowedBooks}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              !item.status &&
              <Card style={styles.card} key={item.id}>
                <View style={styles.bookContainer}>
                  <Image
                    source={{ uri: item.image || 'https://www.seekpng.com/png/detail/238-2389220_white-papers-default-book.png' }}
                    style={styles.bookImage}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.author}>by {item.author}</Text>
                    <Text style={[styles.status, item.status === 'returned' ? styles.returned : styles.borrowed]}>
                      {item.status === true ? '✅ Returned' : '📖 Borrowed'}
                    </Text>
                    {item.status !== 'returned' && (
                      <Button mode="contained" onPress={() => returnBook(item.id)} style={styles.returnButton}>
                        Return Book
                      </Button>
                    )}
                  </View>
                </View>
              </Card>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  borrowed: {
    color: '#E63946',
  },
  returned: {
    color: '#4CAF50',
  },
  returnButton: {
    backgroundColor: '#E63946',
    marginTop: 5,
  },
});
