import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Colors } from '../(tabs)/Constants/Colors';

// URL ngrok và webhook path
const N8N_URL = 'https://6843-14-241-120-189.ngrok-free.app/webhook/chatbot-demo3';

export default function ChatbotScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);                                                                                                                     
  const [sessionId, setSessionId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Tạo session ID khi component mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setChatHistory([
      { 
        id: Date.now(), 
        text: 'Xin chào! Tôi là chatbot Mytrip. Hỏi tôi bất cứ điều gì!', 
        sender: 'bot',
        timestamp: new Date()
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
   
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
   
    try {
      const response = await axios.post(N8N_URL, {
        message: message,
        sessionId: sessionId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      console.log('✅ Response from n8n:', response.data);
    
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.output || 'Không có phản hồi từ AI.',
        sender: 'bot',
        timestamp: new Date()
      };
   
      setChatHistory((prev) => [...prev, botMessage]);
      // Cuộn xuống tin nhắn mới nhất sau khi bot trả lời
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
   
    } catch (error) {
      console.error('❌ Error from n8n:', error.response?.data || error.message);
      const errorMessage = {
        id: Date.now() + 2,
        text: 'Có lỗi khi gửi đến AI. Vui lòng thử lại!',
        sender: 'bot',
        timestamp: new Date()
      };
   
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageRow,
      item.sender === 'user' ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
    ]}>
      {item.sender === 'bot' && (
        <View style={styles.avatarBot}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </View>
      )}
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.sender === 'user' ? '#fff' : '#222' }
        ]}>{item.text}</Text>
        {item.timestamp && (
          <Text style={[
            styles.timestamp,
            { color: item.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        )}
      </View>
      {item.sender === 'user' && (
        <View style={styles.avatarUser}>
          <Ionicons name="person" size={24} color="#fff" />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chatbot My Trip</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={Colors.PRIMARY} />
          <Text style={styles.typingText}>Bot đang nhập...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={isTyping}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4086D5',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#4086D5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    top: Platform.OS === 'ios' ? 50 : 15,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  avatarBot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4086D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0057b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#0057b8',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: '#e3f0fc',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0057b8',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
    color: '#4086D5',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  typingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
});