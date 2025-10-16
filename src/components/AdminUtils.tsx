import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Text,
  ActivityIndicator,
  Chip,
  Searchbar,
  List,
  Avatar,
} from 'react-native-paper';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { supabaseHelpers } from '../config/supabase';
import { User } from '../types';

interface AdminUtilsProps {
  visible?: boolean;
}

const AdminUtils: React.FC<AdminUtilsProps> = ({ visible = true }) => {
  const { makeUserAdmin, syncAllAuthUsers, user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncResults, setSyncResults] = useState<{ syncedCount: number; errorCount: number } | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Load all users for admin management
  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await supabaseHelpers.userProfiles.getAll();
      setUsers(allUsers || []);
      setFilteredUsers(allUsers || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showUserManagement) {
      loadUsers();
    }
  }, [showUserManagement]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleMakeCurrentUserAdmin = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await makeUserAdmin(user.id);
      Alert.alert('Success', 'You are now an admin!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeUserAdmin = async (userId: string, userName: string) => {
    setLoading(true);
    try {
      await makeUserAdmin(userId);
      Alert.alert('Success', `${userName} is now an admin!`);
      // Refresh users list
      loadUsers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllUsers = async () => {
    setLoading(true);
    try {
      const results = await syncAllAuthUsers();
      setSyncResults(results);
      Alert.alert('Sync Complete', `Synced ${results.syncedCount} users, ${results.errorCount} errors`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sync users');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || user?.role !== 'admin') {
    return null;
  }

  const renderUserItem = ({ item }: { item: User }) => (
    <List.Item
      title={item.name}
      description={`${item.email} • ${item.company} • ${item.department}`}
      left={(props) => (
        <Avatar.Text
          {...props}
          size={40}
          label={item.name.charAt(0).toUpperCase()}
        />
      )}
      right={(props) => (
        <View {...props} style={styles.userActions}>
          <Chip
            style={[
              styles.roleChip,
              item.role === 'admin' ? styles.adminChip : styles.userChip,
            ]}
            textStyle={{ color: 'white', fontSize: 12 }}
          >
            {item.role}
          </Chip>
          {item.id !== user?.id && (
            <Button
              mode="outlined"
              onPress={() => handleMakeUserAdmin(item.id, item.name)}
              disabled={loading}
              style={styles.promoteButton}
            >
              {item.role === 'admin' ? 'Demote' : 'Make Admin'}
            </Button>
          )}
        </View>
      )}
    />
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Admin Tools</Title>
        <Paragraph>Manage users and roles</Paragraph>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleMakeCurrentUserAdmin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Make Me Admin
          </Button>

          <Button
            mode="outlined"
            onPress={() => setShowUserManagement(!showUserManagement)}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {showUserManagement ? 'Hide User Management' : 'Manage Users'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleSyncAllUsers}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sync All Auth Users
          </Button>
        </View>

        {showUserManagement && (
          <View style={styles.userManagement}>
            <Title style={styles.sectionTitle}>User Management</Title>

            <Searchbar
              placeholder="Search users..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />

            {loading ? (
              <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
              <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                style={styles.userList}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No users found</Text>
                }
              />
            )}
          </View>
        )}

        {syncResults && (
          <View style={styles.resultsContainer}>
            <Text variant="bodyMedium">
              Last sync: {syncResults.syncedCount} users synced, {syncResults.errorCount} errors
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  resultsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  userManagement: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  searchBar: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 20,
  },
  userList: {
    maxHeight: 300,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleChip: {
    height: 28,
  },
  adminChip: {
    backgroundColor: '#4CAF50',
  },
  userChip: {
    backgroundColor: '#2196F3',
  },
  promoteButton: {
    marginLeft: 8,
  },
});

export default AdminUtils;
