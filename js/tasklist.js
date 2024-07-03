var jwtToken;
function getCookie(cookieName) {
  const cookies = document.cookie.split("; ");
  // console.log(cookies);
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      // console.log(decodeURIComponent(value));
      return decodeURIComponent(value);
    }
  }
  return null;
}
var tasks;
window.onload = async () => {
  jwtToken = getCookie("myToken");
  username = getUserName(jwtToken);
  document.getElementById("username1").textContent = `${username}`;
  tasks = await getTasks();
};

function search(event) {
  if (event.keyCode == 13) {
    createTaskJson();
  }
}

function getUserName(jwtToken) {
  var base64Payload = jwtToken.split(".")[1];
  var payload = decodeURIComponent(
    atob(base64Payload)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(payload).sub;
}

async function signout() {
  const url =
    "https://login-service-ce5ur4umqa-uc.a.run.app/login-service/signout";
  const authToken = jwtToken;
  try {
    alert("Are you sure want to Sign Out ?" + username);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`, // Replace with your actual authorization token
      },
    });
    if (response.ok) {
      const signinUrl =
        "https://to-do-list-app-frontend-ce5ur4umqa-uc.a.run.app/login.html";
      window.location.href = signinUrl;
    } else {
      console.error(
        "Error logging out:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("An error occurred while logging out:", error);
  }
}

/**
 * Creates a task JSON object with the given task name.
 * @param {string} taskName - The name of the task.
 * @returns {Object} - A JSON object representing the task.
 */
function createTaskJson() {
  const taskName = document.getElementById("new-task-input").value;
  console.log("Task Name", taskName);
  const taskData = {
    taskName: taskName,
  };
  // return taskData;
  createTask(taskData);
}

/**
 * Creates a task using the provided data.
 * @param {string} taskName - The URL for creating the task.
 * @param {Object} jsonData - The JSON data containing the task name.
 * @param {string} authToken - The authorization token.
 * @returns {Promise} - A Promise representing the completion of the request.
 */
async function createTask(taskData) {
  const url =
    "https://to-do-service-ce5ur4umqa-uc.a.run.app/api/tasks/create";
  const jsonData = taskData;
  const authToken = jwtToken;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`, // Replace with your actual authorization token
        // 'Access-Control-Allow-Headers': 'Authorization'
      },
      body: JSON.stringify(jsonData),
    });
    if (response.ok) {
      const result = await response.json();
      alert("Task Created Successfully");
      console.log("Task created successfully:", result);
      window.location.reload();
    } else {
      console.error(
        "Error creating task:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("An error occurred while creating the task:", error);
  }
}

async function updateTaskStatus(taskId, taskName, completed) {
  const url = `https://to-do-service-ce5ur4umqa-uc.a.run.app/api/tasks/update/${taskId}?taskName=${taskName}&isCompleted=${completed}`;
  // const jsonData = { completed };
  try {
    const response = await fetch(url, {
      method: "PATCH",
      // mode : 'no-cors',
      headers: {
        "Access-Control-Request-Headers": "access-control-allow-origin",
      },
    });
    if (response.ok) {
      console.log("Task status updated successfully:", response);
      // Update the checkbox element in the table row
      const checkbox = document.querySelector(
        `#task-${taskId} input[type="checkbox"]`
      );
      // checkbox.checked = completed;
    } else {
      console.error(
        "Error updating task status:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(
      "An error occurred while updating the task status:",
      error
    );
  }
}

async function deleteTask(taskId) {
  const url = `https://to-do-service-ce5ur4umqa-uc.a.run.app/api/tasks/delete/${taskId}`;
  var confirmDelete = confirm("Are you Sure want to delete this task ?");
  // const jsonData = { completed };
  if (confirmDelete) {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        // mode : 'no-cors',
        headers: {
          "Access-Control-Request-Headers": "access-control-allow-origin",
        },
      });

      if (response.ok) {
        console.log("Task status deleted successfully:", response);
        const deleteButton = document.querySelector(
          `#task-${taskId} .btn-danger`
        );
        deleteButton.cl;
        // Update the checkbox element in the table row
      } else {
        console.error(
          "Error updating task status:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the task status:",
        error
      );
    }
  }
}

function getTasks() {
  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `https://to-do-service-ce5ur4umqa-uc.a.run.app/api/tasks/username/${username}`;
      xhr.open("GET", url, true);
      xhr.send();

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.response);
          resolve(data); // Resolve the promise with the fetched data
          createTableRows(data);
          return data;
        } else {
          reject("Error fetching tasks: " + xhr.status);
        }
      };

      xhr.onerror = () => {
        reject("An error occurred while fetching tasks.");
      };
    });
  } catch (error) {
    console.error("An error occurred while fetching tasks:", error);
  }
}

function createTableRows(tasks) {
  const taskContainer = document.getElementById("task-container");
  const tbody = document.querySelector("#taskContent tbody"); // Select the tbody element

  // Clear existing rows (optional, if needed)
  tbody.innerHTML = "";
  tasks.forEach((task) => {
    const row = document.createElement("tr");

    const taskIdCell = document.createElement("td");
    taskIdCell.textContent = task.id;
    row.appendChild(taskIdCell);
    // Task Description
    const taskNameCell = document.createElement("td");
    taskNameCell.textContent = task.taskName;
    row.appendChild(taskNameCell);

    // Completed Checkbox
    const completedCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      updateTaskStatus(task.id, task.taskName, checkbox.checked);
    });
    completedCell.appendChild(checkbox);
    row.appendChild(completedCell);

    // Due Date
    const dueDateCell = document.createElement("td");
    dueDateCell.textContent = task.dueDate;
    row.appendChild(dueDateCell);

    // Actions (Edit and Delete buttons)
    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.className = "btn btn-primary btn-sm";
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Delete";
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
      window.location.reload();
    });
    row.appendChild(actionsCell);

    // Append the row to the tbody
    tbody.appendChild(row);
  });
}
// showTasks()
//   document.addEventListener('DOMContentLoaded', function () {
//             var calendarEl = document.getElementById('calendar');
//             var calendar = new FullCalendar.Calendar(calendarEl, {
//                 initialView: 'dayGridMonth',
//                 events: [
//                     // Your task data
//                     {
//                         title: 'Task 1',
//                         start: '2024-05-02'
//                     }
//                     // Add more tasks here
//                 ]
//             });
//             calendar.render();
//         });

// Open the Tasks tab by default
// document.getElementById("defaultOpen").click();

// Update time every second
function updateTime() {
  document.getElementById("time").textContent =
    new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);

// Add more JavaScript functionality as needed for task management
// ...
