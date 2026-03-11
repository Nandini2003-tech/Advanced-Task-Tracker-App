let tasks = JSON.parse(localStorage.getItem("taskss")) || [];
let editId = null;
displayTasks();

// dashboard----------------------------------------------------
function updateDashboard() {
  let total = tasks.length;
  let completed = tasks.filter((task) => task.completed).length;
  let pending = tasks.filter((task) => !task.completed).length;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
}

// form--------------------------------------------------------
const form = document.getElementById("taskForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let title = document.getElementById("title").value;
  let dueDate = document.getElementById("dueDate").value;
  let priority = document.getElementById("priority").value;

  if (editId === null) {
    // new task add
    let newTask = {
      id: Date.now(),
      title: title,
      dueDate: dueDate,
      priority: priority,
      completed: false,
    };

    tasks.push(newTask);
  } else {
    let task = tasks.find((t) => t.id === editId);
    task.title = title;
    task.priority = priority;
    task.dueDate = dueDate;
    editId = null;
  }
  // saving task
  localStorage.setItem("taskss", JSON.stringify(tasks));
  displayTasks();
  updateDashboard();
  form.reset();

  showPopup();
});

// showpopup
function showPopup(){

let popup = document.getElementById("popup");

popup.style.display = "block";

setTimeout(()=>{
popup.style.display = "none";
},2000);

}

// task display on screen-------------------------------------
function displayTasks(taskList = tasks) {
  let container = document.getElementById("tasksContainer");
  container.innerHTML = "";
  if (taskList.length === 0) {
    container.innerHTML = "<p>No tasks yet</p>";
    return;
  }
  taskList.forEach((task) => {
    let today = new Date().toISOString().split("T")[0];
    let status = "";
    if (!task.dueDate){
      status = "No Date";
    } else if (task.dueDate < today) {
      status = "<span style='color:red'>Overdue</span>";
    } else if (task.dueDate === today) {
      status = "<span style='color:orange'>Due Today</span>";
    } else {
      status = "<span style='color:green'>Upcoming</span>";
    }

    let taskCard1 = document.createElement("div");
    taskCard1.classList.add("task-card");
    taskCard1.innerHTML = `
 <h3 class="task-title">${task.title}</h3>
 <div class="priority">
  <div class="dot ${task.priority.toLowerCase()}">
 </div>
  <span>Priority: ${task.priority}</span>
 </div>
<p>Due Date: ${task.dueDate}</p>
<p>Status: ${status}</p>
<div class="cardbtns">
<button onclick="complete(${task.id})"><i class="fa-solid fa-check"></i></button>
<button onclick="editTask(${task.id})"><i class="fa-solid fa-pen-to-square"></i></button>
<button onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash-can"></i></button>
</div>
`;
    if (task.completed) {
      taskCard1.classList.add("completed");
    }
    container.appendChild(taskCard1);
});
  updateDashboard();
}

// display task cards 3-buttons logic
// complete
function complete(id) {

  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem("taskss", JSON.stringify(tasks));
  displayTasks();
  updateDashboard();
}
// edit task
function editTask(id) {
    let task = tasks.find((t) => t.id === id);

     if(task.completed){
      alert("Completed task cannot be edited");
      return;
     }
  let addtask = document.querySelector(".add-task");
  document.getElementById("title").value = task.title;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
  editId = id;
  window.scrollTo({
    top: addtask.offsetTop - 80,
    behavior: "smooth",
  });
}
// delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("taskss", JSON.stringify(tasks));
  displayTasks();
  updateDashboard();
}

// search task logic--------------
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  let value = searchInput.value.toLowerCase();
  let filtered = tasks.filter((task) =>
    task.title.toLowerCase().includes(value),
  );
  displayTasks(filtered);
});

// 4- filters portion ----------------------------

// all
function showAll() {
  displayTasks(tasks);
}
// show completed
function showCompleted() {
  let completedTasks = tasks.filter((task) => task.completed);

  displayTasks(completedTasks);
}
// pending 
function showPending() {
  let pendingTasks = tasks.filter((task) => !task.completed);

  displayTasks(pendingTasks);
}
// clearCompleted
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  localStorage.setItem("taskss", JSON.stringify(tasks));
  displayTasks();
  updateDashboard();
}


// responsive navbar 
let menuBar = document.querySelector('#menuBar');
let ulList=document.querySelector('.task-ul');
let navLinks = document.querySelectorAll("nav ul li a");

menuBar.addEventListener('click',()=>{
  ulList.classList.toggle('active');
});

// link click -menu close
navLinks.forEach(link=>{
  link.addEventListener("click",()=>{
    ulList.classList.remove("active");
  })
});
