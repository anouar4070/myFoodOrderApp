import useHttp from "../hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";

const requestConfig = {}; //created outside to avoid infinite loop 

export default function Meals() {
 const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, [] );

  if (isLoading) {
    return <p className="center">Fetching meals...</p>
  }

if(error) {
  return <Error title="Failed to fetch meals" message={error} />
}


  // if (!data) {
  //   return <p>No meals found.</p>
  // }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}



//& without custom useHttp.js hook
// import { useEffect, useState } from "react";
// import MealItem from "./MealItem";

// export default function Meals() {
//   const [loadedMeals, setLoadedMeals] = useState([]);

//   useEffect(() => {
//     async function fetchMeals() {
//       const response = await fetch("http://localhost:3000/meals");

//       if (!response.ok) {
//         // ...
//       }

//       const meals = await response.json(); // Convert response to JS  objet
//       setLoadedMeals(meals);
//     }

//     fetchMeals();
//   }, []);

//   return (
//     <ul id="meals">
//       {loadedMeals.map((meal) => (
//        <MealItem key={meal.id} meal={meal} />
//       ))}
//     </ul>
//   );
// }