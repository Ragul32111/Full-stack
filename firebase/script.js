import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVD6i_IoHE6LewfdH3UyhG0StWDkg_s6I",
  authDomain: "ragul-965c8.firebaseapp.com",
  databaseURL: "https://ragul-965c8-default-rtdb.firebaseio.com",
  projectId: "ragul-965c8",
  storageBucket: "ragul-965c8.firebasestorage.app",
  messagingSenderId: "1017041746366",
  appId: "1:1017041746366:web:f0d770a4e405457b7621ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in with Google
async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert(`Google Sign-In Successful! Welcome, ${result.user.email}`);
  } catch (error) {
    alert(error.message);
  }
}

// Sign out
async function signOutUser() {
  try {
    await signOut(auth);
    alert("You have been signed out.");
    updateUIForSignOut();
  } catch (error) {
    alert(error.message);
  }
}

// Update UI for sign-out
function updateUIForSignOut() {
  const authSection = document.getElementById("authSection");
  const todoSection = document.getElementById("todoSection");
  const welcomeMessage = document.getElementById("welcomeMessage");

  // Show the auth section
  authSection.style.display = "block";

  // Hide the to-do section and welcome message
  todoSection.classList.add("hidden");
  welcomeMessage.style.display = "none";
}

// Show To-Do Page and Welcome Message
function showToDoPage(user) {
  const welcomeMessage = document.getElementById("welcomeMessage");
  const userNameSpan = document.getElementById("userName");
  const authSection = document.getElementById("authSection");
  const todoSection = document.getElementById("todoSection");

  // Set the display name or email in the welcome message
  const displayName = user.displayName || user.email;
  userNameSpan.textContent = displayName;

  // Show the welcome message
  welcomeMessage.style.display = "block";

  // Hide Authentication Section and Show To-Do List
  authSection.style.display = "none";
  todoSection.classList.remove("hidden");
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    showToDoPage(user);
  } else {
    updateUIForSignOut();
  }
});

// Event Listeners
document.getElementById("googleSignInBtn").addEventListener("click", googleSignIn);
document.getElementById("signOutBtn").addEventListener("click", signOutUser);

document.addEventListener("DOMContentLoaded", () => {
  const addTodoBtn = document.getElementById("addTodo");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");

  // Toastify Notification
  function showToast(message, color = "#007bff") {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: color,
    }).showToast();
  }

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      createTaskElement(task.text, task.status);
    });
  }

  // Save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#todoList li").forEach((li) => {
      tasks.push({
        text: li.querySelector("span").textContent,
        status: li.getAttribute("data-status"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Create task element
  function createTaskElement(taskText, status = "Pending") {
    const li = document.createElement("li");
    li.setAttribute("data-status", status);
    li.innerHTML = `
      <span>${taskText}</span>
      <span class="status ${status}">${status}</span>
      <div class="btn">
        <button id="pendi" class="toggle-status" >${status === "Pending" ? "Complete" : "Pending"}</button>
        <button class="edit" >Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    todoList.appendChild(li);

    li.querySelector(".toggle-status").addEventListener("click", () => {
      const currentStatus = li.getAttribute("data-status");
      const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
      li.setAttribute("data-status", newStatus);
      li.querySelector(".status").textContent = newStatus;
      saveTasks();
      showToast(`Task ${newStatus}`);
    });

    li.querySelector(".edit").addEventListener("click", () => {
      const newText = prompt("Edit your task:", li.querySelector("span").textContent);
      if (newText) {
        li.querySelector("span").textContent = newText;
        saveTasks();
        showToast("Task updated");
      }
    });

    li.querySelector(".delete").addEventListener("click", () => {
      li.remove();
      saveTasks();
      showToast("Task deleted");
    });
  }

  addTodoBtn.addEventListener("click", () => {
    const todoText = todoInput.value.trim();
    if (todoText) {
      createTaskElement(todoText);
      saveTasks();
      todoInput.value = "";
      showToast("Task added");
    }
  });

  loadTasks();
});
