import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('all');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = id => {
    const movie = movies.find(movie => movie.id === id);
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };
  useEffect(() => {
    fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}}`)
      .then(response => response.json())
      .then(data =>
        setMovies(data.map(movie => ({...movie.show, expanded: false}))),
      )
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const toggleExpanded = id => {
    setMovies(
      movies.map(movie =>
        movie.id === id ? {...movie, expanded: !movie.expanded} : movie,
      ),
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedMovie && (
              <>
                <Image
                  source={{uri: selectedMovie.image.original}}
                  style={styles.modalImage}
                />
                <Text style={styles.movieName}>{selectedMovie.name}</Text>
                <Text style={styles.movieGenre}>
                  {selectedMovie.genres.join(', ')}, {selectedMovie.language}
                </Text>
                <Text
                  style={
                    styles.movieRating
                  }>{`Rating: ${selectedMovie.rating.average} ⭐`}</Text>
                <Text style={styles.movieSummary}>
                  Status: {selectedMovie.status || 'N/A'}
                  {'\n'}
                  Runtime: {selectedMovie.runtime || 'N/A'}
                  {'\n'}
                  Premiered: {selectedMovie.premiered || 'N/A'}
                  {'\n'}
                  Official Site: {selectedMovie.officialSite || 'N/A'}
                  {'\n'}
                  Schedule: {selectedMovie.schedule?.time || 'N/A'}
                  {'\n'}
                  Days: {selectedMovie.schedule?.days.join(', ') || 'N/A'}
                  {'\n'}
                  Weight: {selectedMovie.weight || 'N/A'}
                  {'\n'}
                  Network: {selectedMovie.network?.name || 'N/A'}
                  {'\n'}
                  Country: {selectedMovie.network?.country?.name || 'N/A'}
                  {'\n'}
                  Timezone: {selectedMovie.network?.country?.timezone || 'N/A'}
                  {'\n'}
                  Web Channel: {selectedMovie.webChannel || 'N/A'}
                  {'\n'}
                </Text>
                <Text style={styles.movieSummary}>
                  {selectedMovie.summary.replace(/<[^>]*>?/gm, '')}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          color: '#888',
          backgroundColor: '#000',
          paddingLeft: 10,
        }}
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
        placeholder="Search"
        placeholderTextColor={'#888'}
        color={'#fff'}
      />
      <ScrollView style={styles.container}>
        {movies.map(movie => (
          <View key={movie.id} style={styles.movieContainer}>
            <TouchableOpacity onPress={() => openModal(movie.id)}>
              {movie.image ? (
                <Image
                  source={{uri: movie.image.medium}}
                  style={styles.image}
                />
              ) : (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width={100}
                    height={150}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder>
              )}
            </TouchableOpacity>
            <View style={styles.movieDetails}>
              <Text style={styles.movieName}>{movie.name}</Text>
              <Text style={styles.movieGenre}>
                {movie.genres.join(', ')}, {movie.language}
              </Text>
              <Text
                style={
                  styles.movieRating
                }>{`Rating: ${movie.rating.average} ⭐`}</Text>
              <TouchableOpacity onPress={() => toggleExpanded(movie.id)}>
                <Text style={styles.movieSummary}>
                  {movie.expanded
                    ? movie.summary.replace(/<[^>]*>?/gm, '')
                    : `${movie.summary
                        .replace(/<[^>]*>?/gm, '')
                        .substring(0, 100)}...`}
                </Text>
                <Text style={styles.readMore}>
                  {movie.expanded ? 'Read Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
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
    color: 'red',
  },
  movieContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  movieDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  movieName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieGenre: {
    color: '#888',
  },
  movieStatus: {
    color: '#888',
  },
  movieLanguage: {
    color: '#888',
  },
  moviePremiered: {
    color: '#888',
  },
  movieRuntime: {
    color: '#888',
  },
  movieRating: {
    color: '#888',
  },
  movieSummary: {
    color: '#888',
  },
  readMore: {
    color: '#888',
    textDecorationLine: 'underline',
  },
  image: {
    width: 100,
    height: 150,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
