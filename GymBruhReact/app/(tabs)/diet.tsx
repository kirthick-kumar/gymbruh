import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const meals = [
  {
    title: 'Breakfast',
    name: 'Sausage Breakfast Casserole',
    servings: 12,
    calories: 466,
    protein: 18,
    fat: 35,
    carbs: 19,
    image: 'https://edamam-product-images.s3.amazonaws.com/web-img/b25/b2523d0b391dd48e869f6d5d42e85219.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJIMEYCIQCjCBArTjTZJHi6gCIS%2BwQYbSvj62hV5zIC4%2B3uZcpmkAIhAJN7SkaLUbzXKBwQeI%2Bd2g8ZEIbGsXX9mys1CKHYBbRKKsIFCKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMTg3MDE3MTUwOTg2Igx5cQ22o2hLdYhNFX8qlgWpNVwhW86He92Jr%2B9A0KU0BzUHHezxfWceHZTZW4j5yPSiL%2BOKnCn1la%2BOAb54e3HtW0sqlvki2%2F6awy0fjl8D%2BVoWBG7rr82iyyxb%2BA%2F%2F24HW9CHOAhyDVLj4ahk1Wyak9R1OlbLKWmWoz33EEnHuk9NAj5cto35gbKN0zEtKfwvN1w8vzxpzhdULRsOcMjJJP1jryUYESTEwq5yim2UrmoLBdLO4Q532%2BfmYCe6IvX3RSCXs0H0X3lUnUzgmWMVxqeYKkigcoBGpQSMoDW2YAyDrn%2BqW5Tyg3PKzbu6fn8JzULVFBgwztLpqmqBpZ5K42vIAnaPP9TpVBpNGJZupSWZ%2BRvMlFVArIT6mtSiFUiVFwVB9OFtSqIvpAR6guf%2BSiPdVP2Lh0VVzNItjqiwON5Q5%2FqM769HNTCh7Sk3pn7rvU1NlFLRIsaFG76bcCezbTG1VuY4zhMI%2FaUj45TTi2pHXSHCXQQ4QTW1Ec0sFjYGSrDGjeYUkq5k4PPx8wCP1Jq5bVwzHgDIbLKxSne8%2FgFcHeRwKPNm9VyOCpKqFfv1%2BgFsQnmh3rgvrFF0DtTOuptPfL9hwJxsZcUco9%2BBP8FUakhdmQqNcTukcRs%2BNlht5XmlCeFSE%2BODR6Sl8UEse6exeim6KYfHoQKsMssf7fVOJAm8iGUznEMEpA6XSgy6v00ecjaI4eagEAhqc4tik4uoNf4dE6q7IirHVRPkY27RvPJNWq1Eqh7maLNACANfyVRIEpGzYbqMMEtTF5z3uWLMZlqDB0NLbLbgQhX59zYotYDjHnIcIdVYUQSJflj%2Fnno0vjyUS8ook%2F8TN%2F%2BpI5adEp192Rwt1ghuElhqzOi7y%2F61BcyjupUxn%2FC9FAJbRS8MJEDCIode9BjqwAZXYcjktIzay74E1ACTBLUKhfRfUnFJ9RfJwK75sg7oIVju8h7Yi%2FeMXYNo%2F0Dw5U%2BNNjNaaFW0J%2BalArxMDoX1w%2BmcUr%2FpobJoNhpceBlX2AqqcTX6%2BlkgkjRdX%2Brxz5jUm90ZwddUISB2MWvk5Cq%2FHJWwp9q16YT283VdBfsPKyOvHYkOJ5TiPOPm%2Fwi%2FnTi8K%2FfQHbxJuX3ZeiT62bRGE98vitrMoaiI8Wo6Pgxpq&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250219T140707Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFFDXL22ZE%2F20250219%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=4025b18a7351703878ccb215568742d55f2d853be194a73b0c21a81945f53a1d',
  },
  {
    title: 'Lunch',
    name: 'Roasted fennel and pine nut polpette',
    servings: 4,
    calories: 500,
    protein: 11,
    fat: 36,
    carbs: 33,
    image: 'https://edamam-product-images.s3.amazonaws.com/web-img/1af/1afb3b936f2a6dfa7e87d9ae7b890f77.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJHMEUCIC2lSlbRomkl5hoVHmsuXzhE7cAvLhpK0j9SdjXzD8MYAiEAz%2FGlVRrNP7GeSgzGapYWTYRxGvxOmTcwEfURqOOSj50qwQUIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDOpPgXfgafiNLFDReSqVBfYRk%2B3BqFd5TdJleWGtPCAdIUI7S2G%2BAagbYuidkhwIQMmrSbL5ZCseHFCfFceuCyS3CHW8ml5x%2BNf1SOmL3KpRlnr0sico3M6ZLS5n0ih%2BNFYXrzoW2g0YVDB8CSH5SdDS8YQ874av21WxfUkMEtAO9Jvvtclz4GLiDfjSozati0z5m%2FI0ns5dySkMZKqTfPSj6WDBe4KFPbkujxeD2FxSxgRw%2FDx7ou0CS052AaPLhu5YYgAlbkoyrw0gssj%2FJVWJXz2xUdUeg1ix8yLpEW4ftiLUwiLv3ce%2FjorDKqoTXyADS%2FgIezGsunYw%2FA3IbVVCrYOJSQ9WHz4TivYPu9yboHpUIk4cRDErNehOJ%2FYpdAP1MpYJ4vTvEqvOCjokjWUDSeibwt7VL2Iq5Xml7oQ9TMOsgZCf807MERoE4iE5VlXcpf2EYsroqbsJntKGVNzyJikIvEN%2BpH%2Bxr6Uu5FEIf30g9p3ISvcd%2FW1Dq%2BP1TyeyjWgA0IR3HhMM0kFABl4TDXm33q52lNA7iiJhr%2BjnzZz%2FVF8zLbLOeOqLAkmbd5SsMTHbYzf44pYCh0bN%2FP5Vzi9HTduYo%2Fv88FZJ6W9EDnCQvce8a7bLROdJhE7yT6ly716awD1u%2BUkXrYbo%2FxiWru1dNIH%2BUQInQ4KN18Rg%2FGL1MWtHuhnXqbKQAZ8pYkSXnrmqB8LImQ1RbHwjVkkQRDRo6uxESBbVbCxlqClkm9HxdMt59MNDM1qwR65uWPRIPr8b%2BbK%2FAPTudKdyoqFRdPgN63%2FBGod8FSCUCA72j7RfV6qT2GVC1HCEc7RKTQ42x46VrCWKz8BFY%2BsjCU6O8VQbh7jd7EUl%2BK%2Fr7giqwS7WQdn1oXiXcQ9k1mTtgxI31iMw8qbXvQY6sQEK8%2Bc8V%2F2sSRFUGb34GsONrcngYASRZMj9u79F0H6ccU0EYGuTg41S0Ewp3FFpmfwN8dqeGmgl5KHxrQvX8sHIVGZoP7bSWzymWYyKdtas%2FeNOXCuOJpGiIDHcJPRYofBITydzEjV82q95YDlsRAkPGMoZn9ndZLMJ6kye5fPCkl8dvumCeDM7cV3rDEOflPWYaM%2BWGOrnsxiZms8H1MvqYR7lCJa4B968BCFrP8ZJ3uQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250219T142225Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFGAUEJDLE%2F20250219%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5792e9399c5fc1edf2a7b85bc9f909f6678262fa409d0ddf563350685845d5b3',
  },
  {
    title: 'Dinner',
    name: 'Roasted Garlic-Herb Mushrooms and Butternut Mash',
    servings: 4,
    calories: 499,
    protein: 10,
    fat: 34,
    carbs: 50,
    image: 'https://edamam-product-images.s3.amazonaws.com/web-img/d65/d650e3cf09951c23b103f6d83966bb03.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMSJIMEYCIQCjCBArTjTZJHi6gCIS%2BwQYbSvj62hV5zIC4%2B3uZcpmkAIhAJN7SkaLUbzXKBwQeI%2Bd2g8ZEIbGsXX9mys1CKHYBbRKKsIFCKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMTg3MDE3MTUwOTg2Igx5cQ22o2hLdYhNFX8qlgWpNVwhW86He92Jr%2B9A0KU0BzUHHezxfWceHZTZW4j5yPSiL%2BOKnCn1la%2BOAb54e3HtW0sqlvki2%2F6awy0fjl8D%2BVoWBG7rr82iyyxb%2BA%2F%2F24HW9CHOAhyDVLj4ahk1Wyak9R1OlbLKWmWoz33EEnHuk9NAj5cto35gbKN0zEtKfwvN1w8vzxpzhdULRsOcMjJJP1jryUYESTEwq5yim2UrmoLBdLO4Q532%2BfmYCe6IvX3RSCXs0H0X3lUnUzgmWMVxqeYKkigcoBGpQSMoDW2YAyDrn%2BqW5Tyg3PKzbu6fn8JzULVFBgwztLpqmqBpZ5K42vIAnaPP9TpVBpNGJZupSWZ%2BRvMlFVArIT6mtSiFUiVFwVB9OFtSqIvpAR6guf%2BSiPdVP2Lh0VVzNItjqiwON5Q5%2FqM769HNTCh7Sk3pn7rvU1NlFLRIsaFG76bcCezbTG1VuY4zhMI%2FaUj45TTi2pHXSHCXQQ4QTW1Ec0sFjYGSrDGjeYUkq5k4PPx8wCP1Jq5bVwzHgDIbLKxSne8%2FgFcHeRwKPNm9VyOCpKqFfv1%2BgFsQnmh3rgvrFF0DtTOuptPfL9hwJxsZcUco9%2BBP8FUakhdmQqNcTukcRs%2BNlht5XmlCeFSE%2BODR6Sl8UEse6exeim6KYfHoQKsMssf7fVOJAm8iGUznEMEpA6XSgy6v00ecjaI4eagEAhqc4tik4uoNf4dE6q7IirHVRPkY27RvPJNWq1Eqh7maLNACANfyVRIEpGzYbqMMEtTF5z3uWLMZlqDB0NLbLbgQhX59zYotYDjHnIcIdVYUQSJflj%2Fnno0vjyUS8ook%2F8TN%2F%2BpI5adEp192Rwt1ghuElhqzOi7y%2F61BcyjupUxn%2FC9FAJbRS8MJEDCIode9BjqwAZXYcjktIzay74E1ACTBLUKhfRfUnFJ9RfJwK75sg7oIVju8h7Yi%2FeMXYNo%2F0Dw5U%2BNNjNaaFW0J%2BalArxMDoX1w%2BmcUr%2FpobJoNhpceBlX2AqqcTX6%2BlkgkjRdX%2Brxz5jUm90ZwddUISB2MWvk5Cq%2FHJWwp9q16YT283VdBfsPKyOvHYkOJ5TiPOPm%2Fwi%2FnTi8K%2FfQHbxJuX3ZeiT62bRGE98vitrMoaiI8Wo6Pgxpq&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250219T142200Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFFDXL22ZE%2F20250219%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8d23f15528953ac8c5452ad41d2a394baf07857cc60757f237102420b061b57a',
  },
];

const MealCard = ({ meal }) => (
  <View style={styles.card}>
    <Text style={styles.mealTitle}>{meal.name}</Text>
    <Image source={{ uri: meal.image }} style={styles.image} />
    <Text style={styles.servings}>{meal.servings} servings</Text>
    <Text style={styles.calories}>{meal.calories} kcal</Text>
    <View style={styles.macrosContainer}>
      <Text style={styles.protein}>PROTEIN {meal.protein} g</Text>
      <Text style={styles.fat}>FAT {meal.fat} g</Text>
      <Text style={styles.carbs}>CARB {meal.carbs} g</Text>
    </View>
  </View>
);

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
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
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
