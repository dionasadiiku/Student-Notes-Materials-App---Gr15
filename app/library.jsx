import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const index = () => {
const [tasks, setTasks] = useState([]);

const [task, setTask] = useState("");


  const addTask = () => {
   if (task.trim() === "") return;
    const newTask = {id: Date.now().toString(), title: task}
    setTasks([...tasks,newTask])
    setTask("")
  }

  const renderSeparator = () => (
    <View style={styles.separator}/>
    
  );
  const renderHeader = () => (
    <Text style={styles.listHeader}>Your Notes</Text>
  )
  const renderFooter = () => (
<Text style={styles.listFooter}>End of the library</Text>
  )

  const renderEmptyList = () => (
    <Text style={styles.emptyText}>No books yet.</Text>
  )
  const deleteTask =(id) => {
    setTasks(tasks.filter((item) => item.id !== id))
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle = "white-content" />
      <Text style={styles.title}>Library</Text>
      <View style={styles.row}>
      <TextInput style={styles.input} value={task} onChangeText={setTask} placeholder='Add a new book...' placeholderTextColor="black"/>
      <TouchableOpacity onPress={addTask}>
        <View style={styles.addBtn}>
        <Text style={{ color: 'black'}}>Add Books</Text>
        </View>
      </TouchableOpacity>
      </View>

      <FlatList  style={styles.list} data={tasks} keyExtractor={(item) => item.id} renderItem={({item}) => (
        <View style={styles.taskItem}>
          <Link href='/tasks/23'>
          <Text>{item.title}</Text>
          </Link>
        
        <TouchableOpacity onPress={() => deleteTask(item.id)}>         //router.back() tkthen te faqja paraprake os eme push te nje faqe tjeter kudo qe don
          <Text style={{color: 'red'}}>Delete</Text>
        </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  )
}
export default index

const styles =StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#eab8dcff"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  row: {
    flexDirection: "row",
    marginBottom: 12
  },
  input: {
    flex: 1,
    borderWidth:1,
    borderRadius:8,
    height:50,
    backgroundColor: "white",
    borderColor: "black",
   
  },
  addBtn: {
    borderWidth:1,
    backgroundColor: "white",
    paddingHorizontal:16,
    marginLeft: 8,
    color: "white",
    height:40,
    flex: 1,
    justifyContent: "center",
    borderRadius:8,
    borderColor: "black",
  },
  taskItem: {
    borderWidth:1,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    borderColor: "black",
    
  
  },
  list:{
  paddingHorizontal: 20,
  },
  separator: {
   height: 8,
  },
  listHeader: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom:10
  },
  listFooter: {
    marginTop:10,
    color: "black",
    fontSize: 20,
    textAlign: "center"
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    textAlign: "center"
  }
})