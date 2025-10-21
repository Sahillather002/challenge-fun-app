import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Badge,
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { Notification } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationsContainerProps {
  onNotificationPress?: (notification: Notification) => void;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  onNotificationPress,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { theme } = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'New Competition Available!',
        message: 'Join the "Summer Step Challenge" and compete with your colleagues.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: '2',
        userId: 'user1',
        title: 'Achievement Unlocked! 🎉',
        message: 'You\'ve reached 10,000 steps today! Keep up the great work!',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Competition Reminder',
        message: 'The "Weekly Wellness Challenge" ends in 2 days. Make sure to sync your steps!',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
      {
        id: '4',
        userId: 'user1',
        title: 'Leaderboard Update',
        message: 'You\'ve moved up to 5th place in the current competition!',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
      },
      {
        id: '5',
        userId: 'user1',
        title: 'Payment Successful',
        message: 'Your payment of ₹50 for "Monthly Marathon" has been processed successfully.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert';
      case 'error':
        return 'close-circle';
      default:
        return 'information';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => {
        markAsRead(item.id);
        onNotificationPress?.(item);
      }}
      activeOpacity={0.7}
    >
      <Card
        style={[
          styles.notificationCard,
          {
            backgroundColor: item.read
              ? theme.colors.surface
              : theme.colors.primaryContainer,
            borderLeftWidth: 4,
            borderLeftColor: getNotificationColor(item.type),
          },
        ]}
      >
        <Card.Content>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationTitleContainer}>
              <Icon
                name={getNotificationIcon(item.type)}
                size={20}
                color={getNotificationColor(item.type)}
              />
              <Text
                style={[
                  styles.notificationTitle,
                  {
                    color: item.read
                      ? theme.colors.onSurface
                      : theme.colors.onPrimaryContainer,
                    fontWeight: item.read ? 'normal' : 'bold',
                  },
                ]}
              >
                {item.title}
              </Text>
            </View>
            
            <View style={styles.notificationActions}>
              {!item.read && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
              
              <TouchableOpacity
                onPress={() => deleteNotification(item.id)}
                style={styles.deleteButton}
              >
                <Icon
                  name="close"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[
              styles.notificationMessage,
              {
                color: item.read
                  ? theme.colors.onSurfaceVariant
                  : theme.colors.onPrimaryContainer,
              },
            ]}
          >
            {item.message}
          </Text>

          <View style={styles.notificationFooter}>
            <Text
              style={[
                styles.notificationTime,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {formatTimestamp(item.timestamp)}
            </Text>
            
            <Chip
              style={[
                styles.typeChip,
                { backgroundColor: getNotificationColor(item.type) + '20' },
              ]}
              textStyle={[
                styles.typeChipText,
                { color: getNotificationColor(item.type) },
              ]}
            >
              {item.type}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Notifications</Title>
          {unreadCount > 0 && (
            <Badge
              style={[styles.unreadBadge, { backgroundColor: theme.colors.error }]}
            >
              {unreadCount}
            </Badge>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.markAllReadText, { color: theme.colors.primary }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {['all', 'unread', 'read'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterChip,
              filter === filterType && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === filterType
                    ? theme.colors.onPrimary
                    : theme.colors.onSurface,
                },
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="bell-outline"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {filter === 'unread'
                ? 'All caught up! Check back later for new updates.'
                : 'You\'ll see notifications here when there are new updates.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unreadBadge: {
    marginLeft: 8,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notificationCard: {
    marginBottom: 8,
    elevation: 2,
    borderRadius: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
  },
  typeChip: {
    height: 24,
  },
  typeChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default NotificationsContainer;