import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  // useState
} from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import useHttp from "../hooks/http";

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

function Ingredients() {
  const [userIngredient, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE-INGREDIENT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD-INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientHandler = useCallback((filteredIngredient) => {
    dispatch({ type: "SET", ingredients: filteredIngredient });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://ingredients-384e2-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        "ADD-INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://ingredients-384e2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE-INGREDIENT"
      );
    },
    [sendRequest]
  );

  // const clearError = useCallback(() => {
  //   clear();
  // }, [clear]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredient}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredient, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadingIngredient={filteredIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
