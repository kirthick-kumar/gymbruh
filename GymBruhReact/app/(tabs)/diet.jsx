import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, FlatList, StyleSheet, Animated, ActivityIndicator } from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";

const APP_ID = "fcf480bb";
const APP_KEY = "be86ce88e4e8be1e0716ced3a9f7f599";
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
const DIET_FILTERS = [
  { label: "None", value: "" },
  { label: "High-Protein", value: "high-protein" },
  { label: "High-Fiber", value: "high-fiber" },
  { label: "Low-Fat", value: "low-fat" }
];

const fetchRecipes = async (mealType, dietFilter) => {
  try {
    const dietQuery = dietFilter ? `&diet=${dietFilter}` : "";
    const response = await axios.get(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${mealType}&app_id=${APP_ID}&app_key=${APP_KEY}&mealType=${mealType}${dietQuery}&to=10`,
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
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedDietFilter, setSelectedDietFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      const mealData = await fetchRecipes(selectedMealType, selectedDietFilter);
      setMeals(mealData);
      setLoading(false);
    };
    loadMeals();
  }, [selectedMealType, selectedDietFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Meal Planner</Text>

      {/* Meal Type Dropdown */}
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedMealType(value)}
          items={MEAL_TYPES.map((type) => ({ label: type.toUpperCase(), value: type }))}
          style={pickerStyles}
          placeholder={{ label: "Select Meal Type", value: null }}
        />
      </View>

      {/* Diet Filter Dropdown */}
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedDietFilter(value)}
          items={DIET_FILTERS}
          style={pickerStyles}
          placeholder={{ label: "Select Diet Filter", value: null }}
        />
      </View>

      {/* Meal List */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff7f50" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item, index) => `meal-${index}`}
          renderItem={({ item: meal }) => (
            <MealCard
              meal={meal}
              onPress={() => router.push({ pathname: "/diet/RecipeDetails", params: { meal: JSON.stringify(meal) } })}
            />
          )}
        />
      )}
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

const pickerStyles = {
  inputIOS: styles.picker,
  inputAndroid: styles.picker,
  placeholder: styles.placeholder,
};

export default MealPlan;
