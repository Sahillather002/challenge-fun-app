import React, { useState } from 'react';
import {
  Platform
} from 'react-native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  Switch,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCompetition } from '../../context/MockCompetitionContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Competition } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateCompetitionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'weekly' as 'weekly' | 'monthly',
    entryFee: '50',
    startDate: new Date(),
    endDate: new Date(),
    rules: [] as string[],
    prizes: {
      first: '60',
      second: '30',
      third: '10',
    },
  });

  const [newRule, setNewRule] = useState('');
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
  const { createCompetition, loading } = useCompetition();
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();
  const toast = useToast();

  const handleCreateCompetition = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.rules.length === 0) {
      toast.error('Please add at least one rule');
      return;
    }

    try {
      const competitionData: Partial<Competition> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        entry_fee: parseInt(formData.entryFee),
        start_date: formData.startDate.toISOString(),
        end_date: formData.endDate.toISOString(),
        rules: formData.rules,
        prizes: {
          first: parseInt(formData.prizes.first),
          second: parseInt(formData.prizes.second),
          third: parseInt(formData.prizes.third),
        },
        created_by: user?.id || '',
      };

      await createCompetition(competitionData);
      toast.success('Competition created successfully!');
      navigation.goBack();
    } catch (error: any) {
      toast.error('Failed to create competition: ' + error.message);
    }
  };

  const showDatePickerModal = (type: 'start' | 'end') => {
    setPickerMode(type);
    setShowPicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setFormData(prev => ({
        ...prev,
        [pickerMode === 'start' ? 'startDate' : 'endDate']: selectedDate,
      }));
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button */}
      <View style={[styles.headerBar, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.onSurface} />
        </TouchableOpacity>
        <Title style={[styles.headerTitle, { color: theme.onSurface }]}>Create Competition</Title>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Content>

            <TextInput
              label="Competition Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.typeContainer}>
              <Text style={[styles.label, { color: theme.onSurface }]}>
                Competition Type
              </Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'weekly' && {
                      backgroundColor: theme.primary,
                    },
                  ]}
                  onPress={() => updateFormData('type', 'weekly')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color: formData.type === 'weekly'
                          ? theme.onPrimary
                          : theme.onSurface,
                      },
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.type === 'monthly' && {
                      backgroundColor: theme.primary,
                    },
                  ]}
                  onPress={() => updateFormData('type', 'monthly')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color: formData.type === 'monthly'
                          ? theme.onPrimary
                          : theme.onSurface,
                      },
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              label="Entry Fee (₹)"
              value={formData.entryFee}
              onChangeText={(value) => updateFormData('entryFee', value)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.surfaceVariant }]}
                onPress={() => showDatePickerModal('start')}
              >
                <Icon name="calendar" size={20} color={theme.primary} />
                <View style={styles.dateTextContainer}>
                  <Text style={[styles.dateLabel, { color: theme.onSurfaceVariant }]}>
                    Start Date
                  </Text>
                  <Text style={[styles.dateValue, { color: theme.onSurface }]}>
                    {formData.startDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.surfaceVariant }]}
                onPress={() => showDatePickerModal('end')}
              >
                <Icon name="calendar-end" size={20} color={theme.primary} />
                <View style={styles.dateTextContainer}>
                  <Text style={[styles.dateLabel, { color: theme.onSurfaceVariant }]}>
                    End Date
                  </Text>
                  <Text style={[styles.dateValue, { color: theme.onSurface }]}>
                    {formData.endDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.rulesContainer}>
              <Text style={[styles.label, { color: theme.onSurface }]}>
                Competition Rules
              </Text>

              <View style={styles.addRuleContainer}>
                <TextInput
                  label="Add Rule"
                  value={newRule}
                  onChangeText={setNewRule}
                  mode="outlined"
                  style={styles.ruleInput}
                  right={
                    <TextInput.Icon
                      icon="plus"
                      onPress={addRule}
                      disabled={!newRule.trim()}
                    />
                  }
                />
              </View>

              <View style={styles.rulesList}>
                {formData.rules.map((rule, index) => (
                  <Chip
                    key={index}
                    onClose={() => removeRule(index)}
                    style={[styles.ruleChip, { backgroundColor: theme.surfaceVariant }]}
                    textStyle={{ color: theme.onSurfaceVariant }}
                  >
                    {rule}
                  </Chip>
                ))}
              </View>
            </View>

            <View style={styles.prizesContainer}>
              <Text style={[styles.label, { color: theme.onSurface }]}>
                Prize Distribution (%)
              </Text>

              <View style={styles.prizeInputs}>
                <TextInput
                  label="1st Prize"
                  value={formData.prizes.first}
                  onChangeText={(value) => updateFormData('prizes', {
                    ...formData.prizes,
                    first: value,
                  })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.prizeInput}
                />

                <TextInput
                  label="2nd Prize"
                  value={formData.prizes.second}
                  onChangeText={(value) => updateFormData('prizes', {
                    ...formData.prizes,
                    second: value,
                  })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.prizeInput}
                />

                <TextInput
                  label="3rd Prize"
                  value={formData.prizes.third}
                  onChangeText={(value) => updateFormData('prizes', {
                    ...formData.prizes,
                    third: value,
                  })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.prizeInput}
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleCreateCompetition}
              loading={loading}
              disabled={loading}
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Creating...' : 'Create Competition'}
            </Button>
          </Card.Content>
        </Card>

        {showPicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={formData[pickerMode === 'start' ? 'startDate' : 'endDate']}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showPicker && Platform.OS === 'web' && (
          <View style={styles.webDatePicker}>
            <Text>Web Date Picker - Use browser date input</Text>
            <input
              type="date"
              value={formData[pickerMode === 'start' ? 'startDate' : 'endDate'].toISOString().split('T')[0]}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  [pickerMode === 'start' ? 'startDate' : 'endDate']: selectedDate,
                }));
                setShowPicker(false);
              }}
              style={styles.webDateInput}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  typeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  rulesContainer: {
    marginBottom: 16,
  },
  addRuleContainer: {
    marginBottom: 12,
  },
  ruleInput: {
    marginBottom: 8,
  },
  rulesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ruleChip: {
    marginBottom: 4,
  },
  prizesContainer: {
    marginBottom: 24,
  },
  prizeInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  prizeInput: {
    flex: 1,
  },
  createButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  webDatePicker: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
  },
  webDateInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 16,
  },
});

export default CreateCompetitionScreen;

