"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from 'aws-amplify';

// import awsconfig from './aws-exports';

import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
// Amplify.configure(awsconfig);

Amplify.configure(outputs);

const client = generateClient<Schema>();

console.log('client: ', client)
export default function App() {
  const { signOut } = useAuthenticator();
  const { user } = useAuthenticator((context) => [context.user]);
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  console.log(user)

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        console.log(data)
        setTodos([...data.items])
      },
    });
  }


  useEffect(() => {
    listTodos();
  }, []);

  async function createTodo() {
    const todoListfromPrompt = window.prompt("Todo content")
    if (todoListfromPrompt) {
      const result = await client.models.Todo.create({
        content: todoListfromPrompt,
      });
      console.log('Todo created :', result);
    }
  }

  async function deleteTodo(id: string | number) {
    const admit = window.confirm("Are you sure to delete this item!")
    if (!admit) return
    if (Array.isArray(todos)) {
      const result = await client.models.Todo.delete({ id });
      console.log('Todo delete :', result);
    }
  }

  return (
    <main>
      <div>用户：{user.username} <button onClick={signOut}>Sign out</button> </div>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.content}</span>
            <button onClick={() => { deleteTodo(todo.id) }}>删除</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
