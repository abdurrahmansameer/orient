// Variable to store all the tasks
var MyTasks = {};
// to store all the tasks done
let TasksDone = []
// when the task (li tag) is clicked
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    var completeTask = ev.target.textContent;
    // get the current day
    const date = new Date().getDay()
    // Remove the task from chrome.storage
    let i = 0
    // for each key in MyTasks
    for (const key of Object.keys(MyTasks)){
      // complete the task
      if (completeTask == key){
        // ask to confirm
        var confirmation = confirm("Mark task as complete ?");
        if( confirmation == true ) {
          if (TasksDone ==undefined){
            TasksDone = []
          }
          // put the task, date and type into TasksDone
          let TaskDone = {
            "task": key,
            "day": date,
            "type": MyTasks[key].type
          }
          TasksDone.unshift(TaskDone)
          console.log(TasksDone)
          // delete the task(key) form MyTasks
          delete MyTasks[key];
          // update chrome.storage
          chrome.storage.sync.set({taskdone :TasksDone});
          chrome.storage.sync.set({task :Object(MyTasks)});
          // Remove the task from the screen
          ev.target.remove()
        } else {
          return
        }
      }
    }
  }
});
// when a task (li tag) is right clicked
list.addEventListener('contextmenu', function(ev) {
  // stop the default action
  ev.preventDefault()
  if (ev.target.tagName === 'LI') {
    var removeTask = ev.target.textContent;
      let i = 0
      // go through each key in MyTasks
      for (const key of Object.keys(MyTasks)){
        if (removeTask == key){
          // ask to confirm
          var confirmation = confirm("Do you want to delete the task ?");
          if( confirmation == true ) {
            //delete the task(key) from MyTasks
            delete MyTasks[key];
            chrome.storage.sync.set({task :Object(MyTasks)});
          }else {
            return
          }
        }
      }
    // Remove the task from the screen
    ev.target.remove()
  }
});

// Create a new task
let btn_element = document.getElementById("add");
var input = document.getElementById("task")
// Create a new task when the "enter" key is pressed
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("add").click();
  }
});
// Create a task when clicking on the "+" button
btn_element.addEventListener("click", () => {
  // the div containing the type buttons
  const typeSet = document.querySelector('.tasktype');
  // the type buttons
  let type_1 = document.getElementById("type1");
  let type_2 = document.getElementById("type2");
  let type_3 = document.getElementById("type3");
  // the date put in by the user
  inputValue = input.value;
  // the the data in blank
  if (inputValue === '') {
    alert("Please write a task!");
  } 
  else {
    // make the type buttons visible
    typeSet.style.visibility = 'visible'
    // if the personnel task(type_1) button is clicked
    type_1.addEventListener("click", () => {
      // hide the type buttons
      typeSet.style.visibility = 'hidden'
      // save the task as type 1 in MyTasks
      MyTasks[inputValue] = { type: 1 };
      // set the input value to ""
      input.value = ""
      // update chrome.storage
      chrome.storage.sync.set({task :Object(MyTasks)});
      // run the reset() function
      reset()
    })
    // if the work tasks(type_2) button is clicked
    type_2.addEventListener("click", () => {
      // hide the type buttons
      typeSet.style.visibility = 'hidden'
       // save the task as type 2 in MyTasks
      MyTasks[inputValue] = { type: 2 };
      // set the input value to ""
      input.value = ""
      // update chrome.storage
      chrome.storage.sync.set({task :Object(MyTasks)});
      // run the reset() function
      reset()
    })
    // if the chores(type_3) button is clicked
    type_3.addEventListener("click", () => {
      // hide the type buttons
      typeSet.style.visibility = 'hidden'
       // save the task as type 3 in MyTasks
      MyTasks[inputValue] = { type: 3 };
      // set the input value to ""
      input.value = ""
      // update chrome.storage
      chrome.storage.sync.set({task :Object(MyTasks)});
      // run the reset() function
      reset()
    })
  }
})
// this funcion resets the todo page
function reset(){
  // get the tasks
  chrome.storage.sync.get(['task'], function(data){
    if (data.task != undefined){
      // set the dictionary MyTasks to the data stored in 'task'
      MyTasks = data.task
      // clear the ul myTasks
      const clear = document.getElementById("myTasks");
      clear.innerHTML = '';
      // For each key(task) in the MyTask array add a new task
      for(const key of Object.keys(MyTasks)){
        var li = document.createElement("li");
        var inputValue = key;
        var t = document.createTextNode(inputValue);
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        li.appendChild(t);
        document.getElementById("myTasks").appendChild(li);
        document.getElementById("task").value = "";
        span.appendChild(txt);
      }
    }
  });
}
// When the todo page loads
window.onload = function() {
  // run the reset() function
  reset()
  // get the tasks done and store it in TasksDone
  chrome.storage.sync.get(["taskdone"]).then((data) => {
    TasksDone = data.taskdone
  })
}