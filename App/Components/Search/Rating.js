import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';

const StarRating = ({ rating, onChangeRating }) => {
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleStarPress = (newRating) => {
    setSelectedRating(newRating);
    onChangeRating(newRating);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map((number) => (
        <TouchableOpacity
          key={number}
          onPress={() => handleStarPress(number)}
          style={{ marginRight: 5, alignItems: 'center', alignSelf: 'center', textAlign: 'center' }}
        >
          <AntDesign
            name={number <= selectedRating ? 'star' : 'staro'}
            size={40}
            color={Colors.YELLOW} // Gold color
          />
        </TouchableOpacity>
      ))}
      <Text style={{ color: 'white', fontWeight: 'bold', alignItems: 'center', textAlign: 'center' }}>{selectedRating}/5</Text>
    </View>
  );
};

export default StarRating;
