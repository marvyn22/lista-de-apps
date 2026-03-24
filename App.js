import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, Alert, KeyboardAvoidingView, Platform, 
  Keyboard, LayoutAnimation, UIManager, Vibration 
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  const handleAddTask = () => {
    if (task.trim().length < 3) {
      Vibration.vibrate(100);
      Alert.alert('Ops!', 'Digite pelo menos 3 caracteres para a tarefa.');
      return;
    }

    const newTask = {
      id: Math.random().toString(),
      value: task,
      completed: false,
      createdAt: new Date().getTime(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTaskList([newTask, ...taskList]);
    setTask('');
    Keyboard.dismiss();
  };

  const handleRemoveTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTaskList(taskList.filter(item => item.id !== id));
  };

  const toggleComplete = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTaskList(taskList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ).sort((a, b) => a.completed - b.completed));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.title}>Suas Tarefas</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {taskList.filter(t => t.completed).length}/{taskList.length}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="Adicionar um novo item..."
          placeholderTextColor="#A0A0A0"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.addButton} 
          onPress={handleAddTask}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <FlatList
        data={taskList}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyText}>Tudo limpo por aqui!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.completed && styles.cardCompleted]}>
            <TouchableOpacity 
              style={styles.cardContent} 
              onPress={() => toggleComplete(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.check, item.completed && styles.checkActive]}>
                {item.completed && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
                {item.value}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleRemoveTask(item.id)}
              style={styles.deleteArea}
            >
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statsContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statsText: {
    fontWeight: '700',
    color: '#4CAF50',
  },
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 35,
    fontWeight: '300',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardCompleted: {
    opacity: 0.6,
    backgroundColor: '#E8E8E8',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkActive: {
    backgroundColor: '#4CAF50',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteArea: {
    padding: 10,
    marginLeft: 10,
  },
  deleteIcon: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
  },
});