import React, { useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Animated } from 'react-native';

const meals = [
  {
    title: 'Breakfast',
    name: 'Sausage Breakfast Casserole',
    servings: 12,
    calories: 466,
    protein: 18,
    fat: 35,
    carbs: 19,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgg0nCYK3gTbPWC6-SldIOyDEi6Bloku2GNA&s',
  },
  {
    title: 'Lunch',
    name: 'Roasted fennel and pine nut polpette',
    servings: 4,
    calories: 500,
    protein: 11,
    fat: 36,
    carbs: 33,
    image: 'https://edamam-product-images.s3.amazonaws.com/web-img/1af/1afb3b936f2a6dfa7e87d9ae7b890f77.jpg',
  },
  {
    title: 'Dinner',
    name: 'Roasted Garlic-Herb Mushrooms and Butternut Mash',
    servings: 4,
    calories: 499,
    protein: 10,
    fat: 34,
    carbs: 50,
    image: 'https://edamam-product-images.s3.amazonaws.com/web-img/d65/d650e3cf09951c23b103f6d83966bb03.jpg',
  },
];

const MealCard = ({ meal }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.mealTitle}>{meal.name}</Text>
      <Image source={{ uri: meal.image }} style={styles.image} />
      <Text style={styles.servings}>{meal.servings} servings</Text>
      <Text style={styles.calories}>{meal.calories} kcal</Text>
      <View style={styles.macrosContainer}>
        <Text style={styles.protein}>PROTEIN {meal.protein} g</Text>
        <Text style={styles.fat}>FAT {meal.fat} g</Text>
        <Text style={styles.carbs}>CARB {meal.carbs} g</Text>
      </View>
    </Animated.View>
  );
};

const MealPlan = () => {
  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <MealCard meal={item} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    color: 'white',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
  },
  servings: {
    fontSize: 14,
    color: '#666',
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 5,
  },
  protein: {
    color: 'green',
  },
  fat: {
    color: 'orange',
  },
  carbs: {
    color: 'red',
  },
});

export default MealPlan;
