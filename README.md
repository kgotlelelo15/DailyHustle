# Daily Hustle Dashboard

Daily Hustle is a web-based task management application designed to help you organize your daily activities, set reminders, and stay motivated. It features user authentication, task categorization, task-specific and category-specific motivation, a reminder schedule, and a theme toggle.

## Features

*   **User Authentication:** Secure login, registration, and password reset functionalities.
*   **Task Management:**
    *   Add new tasks with text, optional reminders (date, time, text), and optional motivation messages.
    *   Mark tasks as completed.
    *   Mark tasks as important.
    *   Edit existing tasks.
    *   Remove tasks.
*   **Task Categories:** Organize tasks into predefined categories: "My Day", "Important", "Planned", "Tasks", and "Goals".
*   **Search:** Filter tasks within the currently selected category.
*   **Reminders:** Set date, time, and text reminders for individual tasks.
*   **Reminder Schedule:** View a sorted list of all tasks with reminders in the sidebar, with options to reschedule or remove reminders.
*   **Motivation:**
    *   **General Motivation Card:** A flip card displaying a fixed motivational quote on the front and a user-customizable message on the back.
    *   **Task-Specific Motivation:** Add a unique motivation message to each task, displayed when the task is selected.
    *   **Category-Specific Motivation:** Add a unique motivation message to each category, displayed when the category is selected in the sidebar.
*   **Theme Toggle:** Switch between a light and dark theme.
*   **Color Picker:** Basic functionality to change the body's background color.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript
*   Font Awesome (for icons)

## How to Use

1.  **Clone or Download:** Get the code from the repository or download the files.
2.  **Place Files:** Put the `index.html`, `style.css`, and `script.js` files in the same directory.
3.  **Open `index.html`:** Open the `index.html` file in your web browser.

## Getting Started

1.  **Authentication:**
    *   When you first open the application, you will be presented with an authentication modal.
    *   **Register:** If you don't have an account, click "Register", fill in your details, and click "Register".
    *   **Login:** Use your registered username and password to log in.
    *   **Forgot Password:** Use this option if you need to reset your password (note: the reset functionality in this example is illustrative and doesn't send actual emails).
2.  **Adding Tasks:**
    *   Once logged in, select a category from the sidebar (e.g., "My Day").
    *   Type your task in the "Add a new task..." input field.
    *   Use the bell icon (<i class="fas fa-bell"></i>) to toggle reminder settings (date, time, text).
    *   Use the heart icon (<i class="fas fa-heart"></i>) to toggle the task motivation input field.
    *   Use the folder icon (<i class="fas fa-folder"></i>) to toggle the category motivation input field for the *currently selected category*.
    *   Click "Add Task".
3.  **Managing Tasks:**
    *   Tasks will appear in the list below the input field.
    *   Click the checkbox next to a task to mark it as completed.
    *   Click the star checkbox to mark it as important (this will also move it to the "Important" category).
    *   Click the edit icon (<i class="fas fa-edit"></i>) to edit the task text.
    *   Click the trash icon (<i class="fas fa-trash-alt"></i>) to remove the task.
    *   Click on a task item to select it and view its specific motivation message (if set).
4.  **Managing Motivation:**
    *   **General Card:** Click the large flip card to see the custom message on the back. Click it again to flip back. You will be prompted to set/edit the custom message when flipping to the back.
    *   **Task Motivation:** Select a task from the list to see its motivation below the list. Use the heart icon (<i class="fas fa-heart"></i>) and the input field to add/edit the motivation for the *selected task*.
    *   **Category Motivation:** Select a category from the sidebar to see its motivation below the list. Use the folder icon (<i class="fas fa-folder"></i>) and the input field to add/edit the motivation for the *currently selected category*.
5.  **Managing Reminders:**
    *   Tasks with reminders will show a bell icon (<i class="fas fa-bell"></i>).
    *   Click the calendar-check icon (<i class="fas fa-calendar-check"></i>) next to "Reminder Schedule" in the sidebar to toggle the schedule view.
    *   In the schedule view, click the edit icon (<i class="fas fa-edit"></i>) to reschedule a reminder or the times-circle icon (<i class="fas fa-times-circle"></i>) to remove it.
6.  **Theme and Color:**
    *   Click the paint-brush icon (<i class="fas fa-paint-brush"></i>) in the header to toggle between light and dark themes.
    *   Click the palette icon (<i class="fas fa-palette"></i>) in the task container to open a basic color picker prompt and change the page background color.

## File Structure

## Notes

*   **Data Storage:** User data (usernames, passwords, tasks, motivations) is stored directly in the browser's `localStorage`. This is suitable for a simple local application but is **not secure** for sensitive data in a production environment.
*   **Password Reset:** The password reset functionality is a placeholder and does not actually send emails or reset passwords.
*   **Reminders:** Reminders are currently only displayed in the schedule list. Implementing actual notifications would require server-side code or browser APIs that are beyond the scope of this basic example.
*   **"Limepink" Color:** The "limepink" background for the auth modal is implemented as a lime-yellow gradient, as a direct "limepink" color name isn't standard. You can adjust the hex codes in `style.css` to fine-tune the gradient.

## Contributing

This is a basic example. Feel free to fork the project and add more features like:

*   More robust authentication (backend required).
*   Cloud storage for tasks.
*   Drag and drop task reordering.
*   More detailed task editing (beyond just text).
*   Recurring tasks.
*   Actual reminder notifications.
*   Improved UI/UX.

## License

[Specify your license here, e.g., MIT License]
