import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllTodo } from "../features/todo/todoSlice";

const HomePage = () => {
  const [todos, setTodos] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getAllTodo());

        if (response) {
          setTodos(response.payload);
          console.log(response.payload);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div>
        {todos.length > 0 ? (
          <div>
            {todos.map((todo) => (
              <div key={todo.id} className="flex  justify-center gap-24">
                <div>
                  <h1>{todo.title}</h1>
                </div>
                <h2>{todo.description}</h2>
                <h3>{todo.completed ? "Completed" : "Not Completed"}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div>No Todo Found</div>
        )}
      </div>
    </>
  );
};

export default HomePage;
