// the '+' button
let btn_element = document.getElementById("add");
// the input bar
var input = document.getElementById("time")
// the data entered in the input bar
var timeSet = input.value;
// to add in the data for statistics
let focusTime = []
// When the window loads check if a time is stored and run the countdown() timer
window.onload = function() {
  chrome.storage.sync.get(["set"]).then((result) => {
    check = result.set
    // if it is not - exit
    if (check <= 0 || check === undefined){
      return
    }
    // if it is then set the input value to the stored value and start the countdown(function)
    else{
      input.value = result.set
      countdown()
    }
  })
}
// Add in the time set when the enter key is pressed
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("add").click();
  }
});
// Add in the time set when the '+' button is clicked
btn_element.addEventListener("click", () => {
  // display the amount of time between the current time and the time set
  var timeSet = input.value;
  // the time set
  var countDownDate = new Date(timeSet).getTime();
  // to add in the data to display
  var displayTime=[];
  // the current time
  var now = new Date().getTime();
  // finding the difference between the two times
  var distance = countDownDate - now;
  // check if the time given is valid
  if (distance <= 0){
    alert('Invalid time frame!')
  }
  // display the distance
  else {
    chrome.storage.sync.set({ set: timeSet })
    var hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2,'0');
    var minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
    var seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    // if the coundown has an hour or more in it 
    if (hours > 0) {
      displayTime.push(hours + ':')
      displayTime.push(minutes + ':')
    }
    // if the countdown has only minutes in it
    else {
      displayTime.push(minutes + ':')
    }
    // Output the result in an element with id="countdown"
    document.getElementById("countdown").innerHTML = displayTime + seconds;
    // the 'block' button
    let blk_element = document.getElementById("block");
    // once the 'block' button is pressed start the timer
    blk_element.addEventListener("click", () => {
        // ask the user to confirm and run the countdown() fumction
        if (confirm("Are you sure that you want to block? This action cannot be reversed!")) {
          countdown()
          // to update the statistics
          update()
        }
        else {
          return
        }
    })
  }
})
// this function runs only once when the 'block' button is clicked
// this function updates focusTime so that the data can be used to display statistics
function update(){
  // get the time set by the user
  chrome.storage.sync.get(["set"]).then((result) => {
    // get all the focus times of the user
    chrome.storage.sync.get(["focusTimeSlots"]).then((data) => {
      focusTime = data.focusTimeSlots
      storageTimeSet = result.set
      // get the current day
      const date = new Date().getDay()
      // get the countdown time
      var countDownDate = new Date(storageTimeSet).getTime();
      // get the current time
      var now = new Date().getTime();
      // find the distance
      var distance = countDownDate - now;
      // if the distance is more than zero
      if (distance > 0){ 
        // put the distance and day of the time slot into focus Time
        let focusTimeSlot = {
          "time": distance,
          "day": date,
        }
        focusTime.unshift(focusTimeSlot)
        // update the storage
        chrome.storage.sync.set({focusTimeSlots :focusTime});
      }
    })
  })
}
// countdown function
function countdown(){
  // update the timer every 1 second
  var interval = setInterval(function() {
    // get the time set from storage
    chrome.storage.sync.get(["set"]).then((result) => {
      storageTimeSet = result.set
      // get the count down time
      var countDownDate = new Date(storageTimeSet).getTime();
      // diable the input
      input.disabled = true;
      // to store time to be displayed
      var displayTime=[];
      // get the current time
      now = new Date().getTime();
      // get the distance
      distance = countDownDate - now;  
      // Time calculations for hours, minutes and seconds
      var hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2,'0');
      var minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
      var seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
      // if the countdown has an hour or more
      if (hours > 0) {
        displayTime.push(hours + ':' + minutes)
      }
      // if the countdown has only minutes
      else {
        displayTime.push(minutes + ':')
      }
      // print the time
      document.getElementById("countdown").innerHTML = displayTime + seconds;
      
      // If the count down is over
      if (distance < 0) {
        // stop the function from running every second
        clearInterval(interval);
        // print '00:00'
        document.getElementById("countdown").innerHTML = "00:00";
        // enable the input
        input.disabled = false;
        // make the input value ""
        input.value = ""
        // set the chrome storage to 0
        chrome.storage.sync.set({ set: 0 })
        return
      }
    })
  }, 1000);
}

