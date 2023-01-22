// Variable to store all the url's
var MyUrls=[]
// Remove the website when it is clicked
var list = document.querySelector('ul');
// if any of the url's (li tags) are clicked
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    var removeurl = ev.target.textContent;
    // Remove the website from chrome.storage
    let i = 0
    while (i < MyUrls.length){
      if (removeurl == MyUrls[i]){
        MyUrls.splice(MyUrls.indexOf(MyUrls[i]), 1);
        chrome.storage.sync.set({MyUrls})
        break;
      }
      i++
    }
    // Remove the website from the screen
    ev.target.remove()
  }
});
// Create a new blocklist url
// the add button
let btn_element = document.getElementById("add");
// the input bar
var input = document.getElementById("url")
// Create a new blocklist url when the "enter" key is pressed
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("add").click();
  }
});
// Create a new blocklist url when clicking on the "+" button
btn_element.addEventListener("click", () => {
  // to create an li
  var li = document.createElement("li");
  // to store the data that the user put in
  var inputValue = input.value;
  // to store the url's hostname
  var saveHost;
  // Function to check if the text entered is a valid url
  function isValidHttpUrl(url=inputValue) {
    try {
      const newUrl = new URL(url);
      saveHost = newUrl.hostname
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {  
      return false;
    }
  }
  // if the data in blank
  if (inputValue === '') {
    alert("Please enter a url!");
  }
  // if it is not a valid url
  else if (isValidHttpUrl() === false){
    alert("Please enter a valid url!");
  }
  // display the hostname
  else {    
  var t = document.createTextNode(saveHost);
  li.appendChild(t);
  document.getElementById("myUrls").appendChild(li);
  MyUrls.push(saveHost)
  // update the data in chrome.storage
  chrome.storage.sync.set({MyUrls});
  }
  // set the input bar to ""
  document.getElementById("url").value = "";
})
// When the blocklist page loads get the urls and display it
window.onload = function() {
  chrome.storage.sync.get({MyUrls}, function(data){
    MyUrls = data.MyUrls
    console.log(MyUrls)
    let i = 0;
    // For each element in the Myurl array add a new url
    while (i < MyUrls.length){
      var li = document.createElement("li");
      var inputValue = data.MyUrls[i];
      var t = document.createTextNode(inputValue);
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      li.appendChild(t);
      document.getElementById("myUrls").appendChild(li);
      document.getElementById("url").value = "";
      span.appendChild(txt);
      i++;
    }
  });
}