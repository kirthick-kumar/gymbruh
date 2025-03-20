import React, {useEffect} from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; 
import { router, useNavigation } from 'expo-router';


const RecipeDetails = () => {
  const { meal } = useLocalSearchParams();
  const router = useRouter(); // Initialize router

  const recipe = meal ? JSON.parse(meal) : null;

  if (!recipe) {
    return <Text style={styles.errorText}>Error loading recipe details.</Text>;
  }
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      
      

      
      <Text style={styles.title}>{recipe.label}</Text>

      
      <Image source={{ uri: recipe.image }} style={styles.image} />

      
      <Text style={styles.calories}>{Math.round(recipe.calories)} kcal</Text>
      <View style={styles.macrosContainer}>
        <Text style={styles.protein}>PROTEIN: {Math.round(recipe.totalNutrients.PROCNT?.quantity || 0)} g</Text>
        <Text style={styles.fat}>FAT: {Math.round(recipe.totalNutrients.FAT?.quantity || 0)} g</Text>
        <Text style={styles.carbs}>CARB: {Math.round(recipe.totalNutrients.CHOCDF?.quantity || 0)} g</Text>
      </View>

      
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      <FlatList
        data={recipe.ingredientLines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.ingredient}>{`\u2022 ${item}`}</Text>}
      />

      {/* External Link to Full Recipe */}
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(recipe.url)}>
        <Text style={styles.buttonText}>View Full Recipe Instructions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    paddingTop: 70
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  calories: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  protein: { color: "green", fontWeight: "bold" },
  fat: { color: "orange", fontWeight: "bold" },
  carbs: { color: "red", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  ingredient: {
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RecipeDetails;
