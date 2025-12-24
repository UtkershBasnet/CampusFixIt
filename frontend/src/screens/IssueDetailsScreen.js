import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';

const IssueDetailsScreen = ({ route, navigation }) => {
  const { issue } = route.params;
  const { userRole } = useContext(AuthContext);
  const [status, setStatus] = useState(issue.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await api.patch(`/issues/${issue._id}`, { status: newStatus });
      setStatus(newStatus);
      Alert.alert('Success', 'Status Updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (s) => {
    if (s === 'Resolved') return theme.colors.success;
    if (s === 'In Progress') return theme.colors.primary;
    return theme.colors.warning;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {issue.imageUrl && (
          <Image source={{ uri: issue.imageUrl }} style={styles.image} />
        )}
        
        <Card style={styles.detailsCard}>
          <View style={styles.header}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <Text style={styles.category}>{issue.category}</Text>
          </View>

          <Text style={styles.title}>{issue.title}</Text>
          <Text style={styles.description}>{issue.description}</Text>
          
          <Text style={styles.date}>Reported on: {new Date(issue.createdAt).toLocaleDateString()}</Text>
        </Card>

        {userRole === 'admin' && (
          <View style={styles.adminSection}>
            <Text style={styles.adminTitle}>Admin Controls</Text>
            <View style={styles.controls}>
              <CustomButton 
                title="In Progress"
                onPress={() => updateStatus('In Progress')}
                type={status === 'In Progress' ? 'primary' : 'secondary'}
                style={{ flex: 1, marginRight: 5 }}
                disabled={loading}
              />
               <CustomButton 
                title="Resolved"
                onPress={() => updateStatus('Resolved')}
                style={{ flex: 1, backgroundColor: theme.colors.success }}
                disabled={loading}
              />
            </View>
             <CustomButton 
                title="Re-Open / Pending"
                onPress={() => updateStatus('Pending')}
                type="secondary"
                style={{ marginTop: 5, borderColor: theme.colors.warning, backgroundColor: 'transparent' }}
                disabled={loading}
              />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: theme.spacing.m,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
  },
  detailsCard: {
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  category: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
  },
  description: {
    ...theme.typography.body,
    marginBottom: theme.spacing.m,
    lineHeight: 24,
  },
  date: {
    ...theme.typography.caption,
    marginTop: theme.spacing.m,
  },
  adminSection: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
  },
  adminTitle: {
    ...theme.typography.h2,
    fontSize: 18,
    marginBottom: theme.spacing.m,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default IssueDetailsScreen;
