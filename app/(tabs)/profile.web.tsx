import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';

const Page = () => {
  const [firstName, setFirstName] = useState('Demo');
  const [lastName, setLastName] = useState('User');
  const [email] = useState('demo@example.com');
  const [edit, setEdit] = useState(false);

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      <View style={styles.card}>
        <TouchableOpacity>
          <Image source={{ uri: 'https://placehold.co/100x100/png' }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {!edit && (
            <View style={styles.editRow}>
              <Text style={{ fontFamily: 'mon-b', fontSize: 22 }}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Ionicons name="create-outline" size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          )}
          {edit && (
            <View style={styles.editRow}>
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={[defaultStyles.inputField, { width: 100 }]}
              />
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={[defaultStyles.inputField, { width: 100 }]}
              />
              <TouchableOpacity onPress={() => setEdit(false)}>
                <Ionicons name="checkmark-outline" size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text>{email}</Text>
        <Text>Since {new Date().toLocaleDateString()}</Text>
      </View>

      <Link href={'/(modals)/login'} asChild>
        <Button title="Open Login Demo" color={Colors.dark} />
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default Page;
