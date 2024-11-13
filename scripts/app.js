// Selecting DOM elements
const addTaskBtn = document.querySelector("#add-task"); // Button to add a new task
const taskListContainer = document.querySelector("#tasks"); // Container to display tasks
taskListContainer.innerHTML = ""; // Initial clear for task display

// Initialize taskList with stored tasks from local storage or as an empty array
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Task class to create new task objects
class Task {
  constructor(taskNameValue, taskCategoryValue) {
    this.taskName = taskNameValue; // Task name
    this.taskCategory = taskCategoryValue; // Task category
    this.progress = "pending"; // Task progress status
  }
}

// Function to validate task name and category inputs
function validateTask(taskNameValue, taskCategoryValue) {
  const regex = /^[a-zA-Z0-9]/; // Regular expression to check for a valid starting character

  // Check if task name or category is empty
  if (taskNameValue.trim() === "" || taskCategoryValue.trim() === "") {
    alert("Please fill in both inputs");
    return false;
  }

  // Ensure task name doesn't start with a symbol
  if (!regex.test(taskNameValue)) {
    alert("The first character of the task name cannot be a symbol.");
    return false;
  }

  // Ensure task category doesn't start with a symbol
  if (!regex.test(taskCategoryValue)) {
    alert("The first character of the task category cannot be a symbol.");
    return false;
  }

  // Return true if all validation checks pass
  return true;
}

// Save the current task list to local storage
function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Display all tasks on initial load
displayAllTasks();

// Clear input fields
function clearInputFields() {
  document.querySelector("#task-name").value = "";
  document.querySelector("#task-category").value = "";
}

// Function to add a new task to taskList and save to local storage
function addTask() {
  // Retrieve input values
  const taskNameValue = document.querySelector("#task-name").value;
  const taskCategoryValue = document.querySelector("#task-category").value;

  // Validate input values
  const isValid = validateTask(taskNameValue, taskCategoryValue);

  // If input is valid, create a task and add to taskList array
  if (isValid) {
    const task = new Task(taskNameValue, taskCategoryValue);
    taskList.push(task); // Add new task to array
    saveTaskToLocalStorage(); // Save updated array to local storage
    displayAllTasks(); // Refresh task display
  }
  clearInputFields();
}

// Function to display all tasks from taskList
function displayAllTasks() {
  taskListContainer.innerHTML = ""; // Clear existing tasks
  let taskHTML = ""; // Build the HTML string
  
  if (taskList.length === 0) {
    taskHTML = "<p> No TO-DO task </p>";
  } else {
    taskList.forEach((val, index) => {
      taskHTML += `<li id="list" data-id="${index}">
                      <span class="display-task-name">${val.taskName}</span>
                      <span class="display-task-category">${val.taskCategory}</span>
                      <button class="task-complete-btn">Finished</button>
                      <button class="delete-btn">Delete</button>
                    </li>`;
    });
  }

  taskListContainer.innerHTML = taskHTML; // Assign once after building HTML
  isTaskFinished(); // Check if any tasks are completed
}

// Function to handle task deletion
function deleteTask() {
  taskListContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const listItem = event.target.closest("li");
      const dataIdOfList = listItem.getAttribute("data-id");

      // Find index of task in array and remove it
      const deleteTaskIndex = taskList.findIndex(
        (_, idx) => idx === Number(dataIdOfList)
      );
      taskList.splice(deleteTaskIndex, 1); // Remove task from taskList array

      saveTaskToLocalStorage(); // Save updated array to local storage
      displayAllTasks(); // Refresh task display
    }
  });
}

// Function to mark a task as completed
function taskCompleted() {
  taskListContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-complete-btn")) {
      const listItem = event.target.closest("li");
      const dataIdOfList = listItem.getAttribute("data-id");
      
      // Find the task in the taskList
      const task = taskList[Number(dataIdOfList)];
      
      // Update task progress to 'complete'
      task.progress = "complete";
      
      saveTaskToLocalStorage(); // Save updated task progress to local storage
      listItem.classList.add("complete"); // Add 'complete' class to visually indicate completion
    }
  });
}

// Function to check if a task is marked as completed and update UI
function isTaskFinished() {
  taskList.forEach((task, index) => {
    const listItem = document.querySelector(`[data-id="${index}"]`); // Select the task by its data-id
    if (task.progress === "complete") {
      if (listItem) {
        listItem.classList.add("complete"); // Add 'complete' class to completed tasks
      }
    }
  });
}

// Event listener to add a new task on button click
addTaskBtn.addEventListener("click", addTask);

// Initialize delete and task completion functionality
deleteTask();
taskCompleted();

// Initial display of all tasks
displayAllTasks();
