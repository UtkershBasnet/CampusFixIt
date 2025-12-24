import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../utils/api';
import { theme } from '../theme/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Card from '../components/Card';

const CreateIssueScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Infrastructure', 'Electrical', 'Water', 'Internet', 'Other'];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].base64);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    setLoading(true);
    try {
      await api.post('/issues', {
        title,
        description,
        category,
        imageUrl: image ? `data:image/jpeg;base64,${image}` : null,
      });
      Alert.alert('Success', 'Issue Reported Successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Report New Issue</Text>
          
          <Card style={styles.formCard}>
            <CustomInput
              label="Title"
              placeholder="Brief title of the issue"
              value={title}
              onChangeText={setTitle}
            />

            <CustomInput
              label="Description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${image}` }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    + Add Photo (Optional)
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <CustomButton
              title="Submit Report"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: theme.spacing.m,
  },
  header: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
    color: theme.colors.primary,
  },
  formCard: {
    padding: theme.spacing.l,
  },
  label: {
    marginBottom: theme.spacing.s,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
  categoryChip: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  categoryTextSelected: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  imagePicker: {
    marginVertical: theme.spacing.m,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.m,
  },
  submitButton: {
    marginTop: theme.spacing.m,
  },
});

export default CreateIssueScreen;
