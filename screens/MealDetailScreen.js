import React, { useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton'
import Colors from '../constants/colors'
import DefaultText from '../components/DefaultText'
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavourite } from '../store/actions/meals'

const ListItem = props => {
    return (
        <View style={styles.listItem}>
            <DefaultText>{props.children}</DefaultText>
        </View>)
}

const MealDetailScreen = (props) => {
    const availableMeals = useSelector(state => state.meals.meals)
    const mealId = props.navigation.getParam('mealId')
    const currentMealIsFavourite = useSelector(state => state.meals.favouriteMeals.some(meal => meal.id === mealId))

    const selectedMeal = availableMeals.find(meal => meal.id === mealId)

    const dispatch = useDispatch();
    const toggleFavouriteHandler = useCallback(() => {
        dispatch(toggleFavourite(mealId))
    }, [dispatch, mealId])

    useEffect(() => {
        // props.navigation.setParams({ mealTitle: selectedMeal.title })
        props.navigation.setParams({ toggleFav: toggleFavouriteHandler })
    }, [toggleFavouriteHandler])

    useEffect(() => {
        props.navigation.setParams({ isFav: currentMealIsFavourite })
    }, [currentMealIsFavourite])

    return (
        <ScrollView>
            <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
            <View style={styles.details}>
                <DefaultText>{selectedMeal.duration}m</DefaultText>
                <DefaultText>{selectedMeal.complexity.toUpperCase()}</DefaultText>
                <DefaultText>{selectedMeal.affordability.toUpperCase()}</DefaultText>
            </View>
            <Text style={styles.title}>Ingredients</Text>
            {selectedMeal.ingredients.map(ingredient => (
                <ListItem key={ingredient}>{ingredient}</ListItem>
            ))}
            <Text style={styles.title}>Steps</Text>
            {selectedMeal.steps.map(step => (
                <ListItem key={step}>{step}</ListItem>
            ))}
        </ScrollView>
    )
};

MealDetailScreen.navigationOptions = (navigationData) => {
    // const mealId = navigationData.navigation.getParam('mealId');
    const mealTitle = navigationData.navigation.getParam('mealTitle')
    // const selectedMeal = MEALS.find(meal => meal.id === mealId);
    const toggleFavourite = navigationData.navigation.getParam('toggleFav')

    const isFavourite = navigationData.navigation.getParam('isFav')

    return {
        headerTitle: mealTitle,
        headerRight: (<HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item
                title='Favourite'
                iconName={isFavourite ? 'ios-star' : 'ios-star-outline'}
                onPress={toggleFavourite} />
        </HeaderButtons>),
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 200
    },
    details: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-around'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 22,
        textAlign: 'center',
        padding: 10
    },
    listItem: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10
    }
})

export default MealDetailScreen
