document.addEventListener("DOMContentLoaded", function() {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const removeAllBtn = document.getElementById("removeAllBtn"); // New line

  // Load tasks from storage
  chrome.storage.sync.get("tasks", function(result) {
    const tasks = result.tasks || [];
    displayTasks(tasks);
  });

  // Add new task
  addTaskBtn.addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      // Retrieve existing tasks from storage
      chrome.storage.sync.get("tasks", function(result) {
        const tasks = result.tasks || [];

        // Add new task to the array
        tasks.push({ text: taskText, completed: false });

        // Save the updated tasks in storage
        chrome.storage.sync.set({ tasks: tasks }, function() {
          displayTasks(tasks);
          taskInput.value = "";
          taskInput.focus();
        });
      });
    }
  });

  // Remove all tasks
  removeAllBtn.addEventListener("click", function() {
    chrome.storage.sync.set({ tasks: [] }, function() {
      displayTasks([]);
    });
  });

  // Display tasks
  function displayTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "No tasks found";
      taskList.appendChild(emptyMessage);
      return;
    }

    tasks.forEach(function(task, index) {
      const li = document.createElement("li");
      const taskText = document.createElement("span");
      taskText.textContent = task.text;
      li.appendChild(taskText);

      if (task.completed) {
        li.classList.add("completed");
      }

      const doneButton = document.createElement("button");
      doneButton.classList.add("done-button");
      doneButton.textContent = "Done";
      li.appendChild(doneButton);

      const notDoneButton = document.createElement("button");
      notDoneButton.classList.add("not-done-button");
      notDoneButton.textContent = "Not Done";
      li.appendChild(notDoneButton);

      doneButton.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent event bubbling

        // Mark task as done
        task.completed = true;

        // Save the updated tasks in storage
        chrome.storage.sync.set({ tasks: tasks }, function() {
          displayTasks(tasks);
        });
      });

      notDoneButton.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent event bubbling

        // Mark task as not done
        task.completed = false;

        // Save the updated tasks in storage
        chrome.storage.sync.set({ tasks: tasks }, function() {
          displayTasks(tasks);
        });
      });

      li.addEventListener("click", function() {
        // Update task completion status
        task.completed = !task.completed;

        // Save the updated tasks in storage
        chrome.storage.sync.set({ tasks: tasks }, function() {
          displayTasks(tasks);
        });
      });

      taskList.appendChild(li);
    });
  }
});
