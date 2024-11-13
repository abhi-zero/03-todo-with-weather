const addTaskBtn = document.querySelector("#add-task");
const displayTaskLi = document.querySelector("#tasks");
displayTaskLi.innerHTML = "";

// display task
const displayTask = document.querySelector("#tasks");

// Initialize taskArr with stored tasks or as an empty array
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// class for Task object

class Task {
  constructor(taskNameValue, taskCategoryValue) {
    this.taskName = taskNameValue;
    this.taskCategory = taskCategoryValue;
  }
}

// check input value is valid or not

function validateTask(taskNameValue, taskCategoryValue) {
  const regex = /^[a-zA-Z0-9]/;

  // check's if the Task Name & Task category  value is Empty

  if (taskNameValue.trim() === "" || taskCategoryValue.trim() === "") {
    alert("Please fill in both inputs");
    return false;
  }

  // check if there are symbol at the first Chracter of Task name value;
  if (!regex.test(taskNameValue)) {
    alert("The first character of the task name cannot be a symbol.");
    return false;
  }
  // check if there are symbol at the first Chracter of Task name value;
  if (!regex.test(taskCategoryValue)) {
    alert("The first character of the task category cannot be a symbol.");
    return false;
  }

  // return True if the Values meet all aspect of validation
  else {
    return true;
  }
}

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}
displayAllTasks();
// add Task to the memory which is Array,object and localStorage
function addTask() {
  // input values
  const taskNameValue = document.querySelector("#task-name").value;
  const taskCategoryValue = document.querySelector("#task-category").value;
  // validateTask function return value  accordiong to the validation
  const isValid = validateTask(taskNameValue, taskCategoryValue);
  console.log(taskNameValue, taskCategoryValue);

  console.log(isValid);
  // if the the validateTAsk function return true then this code create a object and push it to the array
  if (isValid) {
    const task = new Task(taskNameValue, taskCategoryValue);
    console.log(task);
    taskList.push(task);
    console.log(taskList);
  }
  // after adding to the array the store to the localstorage
  saveTaskToLocalStorage();
}

function displayAllTasks() {
  // remove li before display the content
  displayTaskLi.innerHTML = "";
  //check is there any task is present in the array if not then print No todo
  if (taskList.length === 0) {
    displayTaskLi.innerHTML = "<p> No TO-DO task </p>";
  } else {
    //display content
    taskList.forEach((val, index) => {
      const displayTask = `<li><span class="Serial-num">${++index}</span><span class="display-task-name">${
        val.taskName
      }</span><span class="display-task-category">${
        val.taskCategory
      }</span><button>Delete</button><button>Finished</button></li>`;
      displayTaskLi.innerHTML += displayTask;
    });
  }
}

addTaskBtn.addEventListener("click", addTask);
