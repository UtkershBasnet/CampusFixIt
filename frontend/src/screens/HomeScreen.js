import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Image, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useIsFocused } from '@react-navigation/native';
import { theme } from '../theme/theme';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';

const HomeScreen = ({ navigation }) => {
  const { userToken, logout, userRole } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const fetchIssues = async () => {
    try {
      const response = await api.get('/issues');
      setIssues(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchIssues();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
        fetchIssues();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('IssueDetails', { issue: item })}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.cardCategory}>{item.category}</Text>
      <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
       {/* Optionally show a snippet or icons here */}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Campus FixIt</Text>
          <Text style={styles.headerSubtitle}>Report & Track Issues</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={issues}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No issues found.</Text>
          </View>
        }
      />

      {userRole === 'student' && (
        <View style={styles.fabContainer}>
            <CustomButton
                title="+ Report Issue"
                onPress={() => navigation.navigate('CreateIssue')}
                style={styles.fab}
            />
        </View>
      )}
    </SafeAreaView>
  );
};

const StatusBadge = ({ status }) => {
    let backgroundColor = theme.colors.warning; // Default Pending/Open
    if (status === 'Resolved') backgroundColor = theme.colors.success;
    if (status === 'In Progress') backgroundColor = theme.colors.primary;

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={styles.badgeText}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.card,
    zIndex: 1, // Ensure shadow is visible
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
  },
  logoutButton: {
    padding: theme.spacing.s,
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.m,
    paddingBottom: 100, // Space for FAB
  },
  card: {
    marginBottom: theme.spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  cardTitle: {
    ...theme.typography.h2,
    fontSize: 18,
    flex: 1,
  },
  cardCategory: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  cardDate: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  badge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.round,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.l,
    left: theme.spacing.l,
    right: theme.spacing.l,
  },
  fab: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
  }
});

export default HomeScreen;
