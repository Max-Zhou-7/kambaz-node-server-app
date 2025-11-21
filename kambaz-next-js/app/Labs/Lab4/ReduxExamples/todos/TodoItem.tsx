"use client";
import { ListGroupItem, Button } from "react-bootstrap";
import { deleteTodo, setTodo } from "./todosReducer";
import { useDispatch } from "react-redux";
export default function TodoItem({ todo }) 

{ const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id}>
      <Button onClick={() => dispatch(deleteTodo(todo.id))}
              id="wd-delete-todo-click"> Delete </Button>
      <Button onClick={() => dispatch(setTodo(todo))}
              id="wd-set-todo-click"> Edit </Button>
      {todo.title}    </ListGroupItem>);}