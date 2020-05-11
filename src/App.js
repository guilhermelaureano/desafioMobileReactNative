import React, {useEffect, useState} from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    })
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    console.log('response:', response.data);
    if(response.status === 200){
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);
      const newRepositories = repositories;
      newRepositories[repositoryIndex] = response.data;
      setRepositories([...newRepositories]);
    } else {
      alert("Ocorreu um erro ao curtir o repositório, verifique sua internet.")
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffcc45" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Lista de Repositórios</Text>
        </View>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository}) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech, key) => {
                  return <Text key={key} style={styles.tech}>{tech}</Text>
                })}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {`${repository.likes} curtidas`}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcc45",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center"
  },
  headerContainer: {
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 10,
  },
  repositoryContainer: {
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#ffcc45",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#000",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: '#fff',
    textAlign: "center",
    textTransform: "uppercase"
  },
});
