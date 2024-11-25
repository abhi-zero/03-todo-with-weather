// Selecting DOM elements
const addTaskBtn = document.querySelector("#add-task"); // Button to add a new task
const taskListContainer = document.querySelector("#tasks"); // Container to display tasks
taskListContainer.innerHTML = ""; // Initial clear for task display
const displayWeatherContainer = document.querySelector("#weather-info")
const getLocationBtn = document.querySelector("#location-btn")

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

// get location 

function getLocation(){
  return new Promise((resolve, reject) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
     
      }
      else{
        reject(new Error("The browser doesn't support geolocation"));
      }
  })

}

// check error  when the getting user location 
function checkError(error) {
  let errorMessage = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = "Please allow your location.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = "Location information unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage = "The request to get your location timed out.";
      break;
    default:
      errorMessage = "An unknown error occurred.";
  }
  document.querySelector("#error").innerHTML = `<p>${errorMessage}</p>`;
}


async function showLocation(position) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}%2C${position.coords.longitude}&key=06d03ee8263b4effb12fa56848088b6f`;

  try{
    const response = await fetch(url);
    if(!response.ok){
      throw new Error("Failed to get Location");
    }
    const result = await response.json();

    const userLocation = result.results[0].components.state_district; ; 
 
    
    return userLocation;
  }
  catch(error){
    console.error("error:",error);
    return null;
  }
}


// api call 

async function showWeather(location){
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&APPID=216f52a6de75221e8233884c7d3439c5`;


 try{
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
    } else if (response.status === 404) {
      throw new Error(`Location not found: ${location}. Please check the location name.`);
    } else if (response.status === 500) {
      throw new Error(`Server Error.`);
    } else {
      throw new Error("Failed to get Weather report");
    }
  }


  const data = await response.json();
  const weatherDescription = data.weather[0].description ;
  const weatherIcon = data.weather[0].icon;
  return {weatherDescription, weatherIcon}

 }
 catch(error){
  console.error(error);
  return null;
 }

}

function displayWeather(weather, location){
  if(!weather){
    displayWeatherContainer.innerHTML = `<p>Weather Data is not Avaliable</p>`
                                       
  }else{
    displayWeatherContainer.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png" alt="Weather Icon">
                                        <h2>${location}</h2>
                                        <p>${weather.weatherDescription}</p>`
  }
}

getLocationBtn.addEventListener("click", async ()=>{
  try{
  const position = await getLocation();
  const location = await  showLocation(position);
  if(location) {
    const weather = await showWeather(location);
   displayWeather(weather,location);
  }
  }
  catch(error){
    checkError(error);
  }  
});


// Event listener to add a new task on button click
addTaskBtn.addEventListener("click", addTask);

// Initialize delete and task completion functionality
deleteTask();
taskCompleted();

// Initial display of all tasks
displayAllTasks();
