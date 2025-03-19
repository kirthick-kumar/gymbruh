import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, FlatList, StyleSheet, Animated, ActivityIndicator } from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";

const APP_ID = "fcf480bb";
const APP_KEY = "be86ce88e4e8be1e0716ced3a9f7f599";
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const fetchRecipes = async (mealType) => {
  try {
    const response = await axios.get(
      `https://api.edamam.com/search?q=${mealType}&app_id=${APP_ID}&app_key=${APP_KEY}&mealType=${mealType}&to=10`,
      {
        headers: { "Edamam-Account-User": "fallguy" },
      }
    );
    return response.data.hits.map((hit) => hit.recipe);
  } catch (error) {
    console.error("Error fetching recipes:", error.response?.data || error.message);
    return [];
  }
};

const MealCard = ({ meal, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: meal.image }} style={styles.image} />
        <Text style={styles.mealTitle}>{meal.label}</Text>
        <Text style={styles.calories}>{Math.round(meal.calories)} kcal</Text>
        <View style={styles.macrosContainer}>
          <Text style={styles.protein}>Protein: {Math.round(meal.totalNutrients.PROCNT?.quantity || 0)}g</Text>
          <Text style={styles.fat}>Fat: {Math.round(meal.totalNutrients.FAT?.quantity || 0)}g</Text>
          <Text style={styles.carbs}>Carbs: {Math.round(meal.totalNutrients.CHOCDF?.quantity || 0)}g</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MealPlan = () => {
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const router = useRouter();

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      const mealData = {};
      for (let type of MEAL_TYPES) {
        mealData[type] = await fetchRecipes(type);
      }
      setMeals(mealData);
      setLoading(false);
    };

    loadMeals();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff7f50" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Meal Planner</Text>

      {/* Improved Dropdown */}
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedMealType(value)}
          items={MEAL_TYPES.map((type) => ({ label: type.toUpperCase(), value: type }))}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
            placeholder: styles.placeholder,
          }}
          placeholder={{ label: "Select Meal Type", value: null }}
        />
      </View>

      {/* List of Meals */}
      <FlatList
        data={meals[selectedMealType] || []}
        keyExtractor={(item, index) => `${selectedMealType}-${index}`}
        renderItem={({ item: meal }) => (
          <MealCard
            meal={meal}
            onPress={() => {
              console.log("Navigating with meal:", meal);
              router.push({
                pathname: "/diet/RecipeDetails",
                params: { meal: JSON.stringify(meal) },
              });
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 15,
  },
  picker: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  placeholder: {
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: "center",
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 5,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
  },
  calories: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 5,
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  protein: { color: "#28a745", fontWeight: "bold" },
  fat: { color: "#ff7f50", fontWeight: "bold" },
  carbs: { color: "#007bff", fontWeight: "bold" },
});

export default MealPlan;
