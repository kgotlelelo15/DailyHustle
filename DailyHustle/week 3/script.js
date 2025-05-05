(function () {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const authModal = document.getElementById('auth-modal');

    // Show the authentication modal on page load
    authModal.style.display = 'flex';

    // Function to render tasks
    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ""; // Clear existing tasks

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false; // Check if the task is completed

            if (checkbox.checked) {
                taskItem.classList.add('completed'); // Add completed class if checked
            }

            // Checkbox click event to toggle completed state
            checkbox.onclick = function () {
                task.completed = checkbox.checked;
                if (task.completed) {
                    taskItem.classList.add('completed');
                } else {
                    taskItem.classList.remove('completed');
                }
                saveTasks(); // Save changes
            };

            taskItem.appendChild(checkbox);
            taskItem.appendChild(document.createTextNode(task.text));

            // Remove task button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = function () {
                tasks.splice(index, 1); // Remove task
                saveTasks();
                renderTasks(); // Re-render task list
            };

            // Edit task button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.onclick = function () {
                const editedTaskText = prompt("Edit task:", task.text);
                if (editedTaskText && editedTaskText.trim() !== "") {
                    tasks[index].text = editedTaskText.trim(); // Update task text
                    saveTasks();
                    renderTasks();
                }
            };

            taskItem.appendChild(editBtn);
            taskItem.appendChild(removeBtn);
            taskList.appendChild(taskItem);
        });
    }

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Authentication Functions
    document.getElementById('login-btn').onclick = function () {
        const username = document.getElementById('username-login').value;
        const password = document.getElementById('password-login').value;

        if (users[username] && users[username].password === password) {
            // Close modal
            authModal.style.display = 'none'; // Close modal
            renderTasks(); // Render tasks
        } else {
            alert('Invalid username or password.');
        }
    };

    document.getElementById('register-btn').onclick = function () {
        const username = document.getElementById('username-register').value;
        const email = document.getElementById('email-register').value;
        const phone = document.getElementById('phone-register').value;
        const password = document.getElementById('password-register').value;

        if (username && email && phone && password) {
            if (!users[username]) {
                users[username] = { password: password, email: email, phone: phone };
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful!');
                // Reset the form and show the login screen
                document.getElementById('username-register').value = ''; 
                document.getElementById('email-register').value = ''; 
                document.getElementById('phone-register').value = ''; 
                document.getElementById('password-register').value = ''; 
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            } else {
                alert('Username already exists!');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    document.getElementById('reset-btn').onclick = function () {
        const email = document.getElementById('email-reset').value;
        const phone = document.getElementById('phone-reset').value;

        let userFound = false;
        for (const username in users) {
            if (users[username].email === email && users[username].phone === phone) {
                userFound = true;
                const newPass = prompt('Please set a new password for ' + username);
                if (newPass) {
                    users[username].password = newPass; // Change password
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Password has been reset successfully!');
                    document.getElementById('reset-form').style.display = 'none';
                    document.getElementById('login-form').style.display = 'block';
                }
                break;
            }
        }
        if (!userFound) {
            alert('User not found with the provided email and phone number.');
        }
    };

    // Show Forms
    document.getElementById('show-register').onclick = function () {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    };

    document.getElementById('show-login').onclick = function () {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    };

    document.getElementById('show-reset').onclick = function () {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('reset-form').style.display = 'block';
    };

    document.getElementById('show-login-from-reset').onclick = function () {
        document.getElementById('reset-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    };

    // Task Input Handling
    document.getElementById('add-task').addEventListener('click', function () {
        const taskInput = document.getElementById('task-input');
        if (taskInput.value.trim() !== "") {
            const newTask = {
                text: taskInput.value.trim(),
                completed: false 
            };
            tasks.push(newTask); 
            saveTasks(); 
            renderTasks(); 
            taskInput.value = ""; 
        } else {
            alert("Task cannot be empty!"); 
        }
    });

    // Initial render of tasks
    renderTasks();
})();