// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-xrct2hqYbRBHJCO42TVutUH5nSVh6pc",
    authDomain: "dailyhustle-71e4a.firebaseapp.com",
    projectId: "dailyhustle-71e4a",
    storageBucket: "dailyhustle-71e4a.appspot.com",
    messagingSenderId: "280118496731",
    appId: "1:280118496731:web:854aa8c551a88dec31abfe",
    measurementId: "G-3L10JGVT4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional: Initialize Firebase Analytics
const auth = getAuth(app); // Initialize Firebase Authentication

// Task storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed || false;

        if (checkbox.checked) {
            taskItem.classList.add('completed');
        }

        checkbox.onclick = function() {
            task.completed = checkbox.checked;
            taskItem.classList.toggle('completed', checkbox.checked);
            saveTasks();
        };

        taskItem.appendChild(checkbox);
        taskItem.appendChild(document.createTextNode(task.text));

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function() {
            tasks.splice(index, 1); // Remove task
            saveTasks();
            renderTasks();
        };

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = function() {
            const editedTaskText = prompt("Edit task:", task.text);
            if (editedTaskText && editedTaskText.trim() !== "") {
                tasks[index].text = editedTaskText.trim();
                saveTasks();
                renderTasks();
            }
        };

        taskItem.appendChild(editBtn);
        taskItem.appendChild(removeBtn);
        taskList.appendChild(taskItem);
    });
}

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Validate and add a new task
document.getElementById('add-task').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    if (taskInput.value.trim() !== "") {
        const newTask = {
            text: taskInput.value.trim(),
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = ""; // Clear input field
    } else {
        alert("Task cannot be empty!");
    }
});

// Show new list modal
document.getElementById('new-list').addEventListener('click', function() {
    document.getElementById('new-list-modal').style.display = 'block';
});

// Close modal functionality
document.querySelectorAll('.close').forEach(function(closeButton) {
    closeButton.onclick = function() {
        closeButton.closest('.modal').style.display = 'none';
    };
});

// Create new list functionality
document.getElementById('create-new-list').addEventListener('click', function() {
    const newListName = document.getElementById('new-list-input').value.trim();
    if (newListName) {
        alert('Creating new list: ' + newListName); // Placeholder for list creation
        document.getElementById('new-list-modal').style.display = 'none'; // Close modal
        document.getElementById('new-list-input').value = ''; // Clear input field
    } else {
        alert('List name cannot be empty!');
    }
});

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
};

// Login functionality
document.getElementById("login-button").addEventListener("click", function() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill in both fields.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully logged in
            const user = userCredential.user;
            console.log(`User ${user.email} logged in successfully.`);
            // Hide login components and show dashboard
            document.getElementById("login-component").style.display = "none";
            document.getElementById("register-component").style.display = "none";
            document.getElementById("reset-password-component").style.display = "none";
            document.getElementById("dashboard-container").style.display = "block";
            // Redirect to your website page
            window.location.href = "index.html"; // Replace with your website URL
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// Registration functionality
document.getElementById("register-link").addEventListener("click", function() {
    document.getElementById("register-modal").style.display = "block";
});

// Handle user registration
document.getElementById("register-button").addEventListener("click", function() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (email === "" || password === "") {
        alert("Please fill in both fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("User registered successfully!");
            document.getElementById("register-component").style.display = "none";
            // Optionally redirect to another page or log the user in
            window.location.href = "index.html"; // Replace with your website URL
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// Reset Password functionality
document.getElementById("forgot-password-link").addEventListener("click", function() {
    document.getElementById("reset-password-modal").style.display = "block"; // Show reset password modal
});

// Handle password reset
document.getElementById("reset-password-button").addEventListener("click", function() {
    const email = document.getElementById("reset-email").value;

    if (email === "") {
        alert("Please enter your email address.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent!");
            document.getElementById("reset-password-modal").style.display = "none";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

function logout() {
    auth.signOut()
        .then(() => {
            console.log('User logged out successfully.');

            // Show login components and hide dashboard
            document.getElementById("login-component").style.display = "block";
            document.getElementById("register-component").style.display = "none";
            document.getElementById("reset-password-component").style.display = "none";
            document.getElementById("dashboard-container").style.display = "none";
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
}

// Logout functionality
document.getElementById("logout-button").addEventListener("click", logout);

// Initial render of tasks
renderTasks();

auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log('User is signed in:', user.uid);

        // Hide login components and show dashboard
        document.getElementById("login-component").style.display = "none";
        document.getElementById("register-component").style.display = "none";
        document.getElementById("reset-password-component").style.display = "none";
        document.getElementById("dashboard-container").style.display = "block";
    } else {
        // No user is signed in.
        console.log('No user is signed in.');

        // Show login components and hide dashboard
        document.getElementById("login-component").style.display = "block";
        document.getElementById("register-component").style.display = "block";
        document.getElementById("reset-password-component").style.display = "block";
        document.getElementById("dashboard-container").style.display = "none";
    }
});