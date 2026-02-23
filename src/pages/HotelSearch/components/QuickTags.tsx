import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {quickTags} from '../../../constants/quickTags';

interface QuickTagsProps {
  keyword: string;
  onTagPress: (tagName: string) => void;
}

const QuickTags: React.FC<QuickTagsProps> = ({keyword, onTagPress}) => {
  return (
    <View style={styles.tagsContainer}>
      <View style={styles.tagsContent}>
        {quickTags.map(tag => (
          <TouchableOpacity
            key={tag.id}
            style={[styles.quickTag, keyword === tag.name && styles.quickTagActive]}
            onPress={() => onTagPress(tag.name)}>
            <Text style={[styles.quickTagText, keyword === tag.name && styles.quickTagTextActive]}>
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    marginBottom: 16,
  },
  tagsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  quickTagActive: {
    backgroundColor: '#e6f7ff',
  },
  quickTagText: {
    fontSize: 12,
    color: '#333',
  },
  quickTagTextActive: {
    color: '#1890ff',
  },
});

export default QuickTags;
