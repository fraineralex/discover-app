import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import CategoryItem from './CategoryItem'

export default function CategoryList({ setSelectedCategory }) {
  const categoryList = [
    {
      id: 1,
      name: 'Gas Station',
      value: 'gas_station',
      icon: require('./../../../assets/gas.png')
    },
    {
      id: 2,
      name: 'Restaurants',
      value: 'restaurant',
      icon: require('./../../../assets/food.png')
    },
    {
      id: 3,
      name: 'Cafe',
      value: 'cafe',
      icon: require('./../../../assets/cafe.png')
    },
    {
      id: 4,
      name: 'School',
      value: 'school',
      icon: require('./../../../assets/school.png')
    },
    {
      id: 5,
      name: 'Hospital',
      value: 'hospital',
      icon: require('./../../../assets/hospital.png')
    },
    {
      id: 6,
      name: 'Store',
      value: 'store',
      icon: require('./../../../assets/store.png')
    },
    {
      id: 7,
      name: 'Park',
      value: 'park',
      icon: require('./../../../assets/park.png')
    },
    {
      id: 7,
      name: 'Gym',
      value: 'gym',
      icon: require('./../../../assets/gym.png')
    },

  ]
  return (
    <View style={{ marginTop: 15 }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'raleway-bold',
        marginTop: 10

      }} >Select Top Category</Text>

      <FlatList
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.value)} >
            <CategoryItem category={item} />
          </TouchableOpacity>
        )}
      />

    </View>
  )
}