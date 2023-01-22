// Array containing popular social media websites
var socialMediaSites = ["www.facebook.com", "www.instagram.com", "www.twitter.com", "www.linkedin.com", "www.snapchat.com", "www.tumblr.com", "www.pinterest.com", "www.reddit.com", "www.tiktok.com", "www.discord.com", "www.youtube.com"]
// for the timer
var timer = 0;
// to store the number of tasks
var tasks = 0;
// to store the current hostname
var currentLocation

// function that tells the user that he/she has been spending a lot of time in a social media site
function socialsAlert(){
    // find the number of tasks
    chrome.storage.sync.get(["task"], function(data){
        MyTasks = data.task
        if (MyTasks != undefined){
            tasks = Object.keys(MyTasks).length
        }
    })
    // Add in the websites from the blocklist into the array as well,
    chrome.storage.sync.get(["MyUrls"], function(data){
        const MyUrls = data.MyUrls
        socialMediaSites.push.apply(socialMediaSites, MyUrls);
        // get rid of duplicates
        socialMediaSites = [...new Set(socialMediaSites)];
    })
    // if the user has tasks, tell the user how many tasks he/she has left at 12 noon
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    if (hour===12 && minute == 00 && second==0){
        if (tasks == 0){
            return
        }
        else if (tasks == 1){
            chrome.notifications.create('tasks left', {
                type: 'basic',
                iconUrl: 'trans-logo.png',
                title: 'Reminder',
                message: 'It is midday and you have '+tasks+' task remaining!',
                priority: 1
            })
        }
        else{
            chrome.notifications.create('tasks left', {
                type: 'basic',
                iconUrl: 'trans-logo.png',
                title: 'Reminder',
                message: 'It is midday and you have '+tasks+' tasks remaining!',
                priority: 1
            })
        }
    }
    // get the current tabs url
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if (tabs[0] == undefined){
            return
        }
        let url = new URL(tabs[0].url)
        // if the website hostname  = any of the elements in the socialMediaSites array
        if (socialMediaSites.includes(url.hostname)){
            // if user is in the same website, increment the timer
            if (currentLocation == location.hostname){
                timer++
            }
            // if not set the current website and set the timer to zero
            else {
                currentLocation = location.hostname
                timer = 0
            }
            // if the timer is 600 (600 * 1000 = 600,000 => 10 mins) tell the user
            if (timer == 600){
                // Array containg quotes
                const quotes = ["Time is what we want most and what we use worst.", "You can not Recycle wasted time.", "Wasting Time Is Robbing Oneself.", "Be picky with who you invest your time in, wasted time is worse than wasted money.", "Time = Life; therefore, waste your time and waste your life, or master your time and master your life."]
                // Randomly select a quote
                var quote = quotes[Math.floor(Math.random()*quotes.length)];
                // tell it to the user based on how many tasks he/she has
                if (tasks > 1){
                    chrome.notifications.create('stop wasting time', {
                        type: 'basic',
                        iconUrl: 'trans-logo.png',
                        title: quote,
                        message: 'You have '+tasks+' tasks remaining, so get back to work!',
                        priority: 1
                    })
                }
                else if (tasks === 1){
                    chrome.notifications.create('stop wasting time', {
                        type: 'basic',
                        iconUrl: 'trans-logo.png',
                        title: quote,
                        message: 'You have '+tasks+' task remaining, try and finish it before the end of the day!',
                        priority: 1
                    })
                }
                else{
                    chrome.notifications.create('stop wasting time', {
                        type: 'basic',
                        iconUrl: 'trans-logo.png',
                        title: quote,
                        message: 'So stop wasting time and get back to work!',
                        priority: 1
                    })
                }
                timer = 0
            }
        }
    })
}

//html and css to replace all the blocked websites
const generateSTYLES = () => {
    return `<style>
    @import url(https://fonts.googleapis.com/css?family=Montserrat);
    body {
        font-family: 'Montserrat';
    }
    .blocked {
        text-align:center;
    }
    </style>`;
}
const generateHTML = () => {
    return `
    <div class="blocked">
        <h1>This Website is Blocked</h1>
    </div>
    `;
}

// the function that displays the above html and css instead of the webpage
function blockSite() {
    // get the urls
    chrome.storage.sync.get(["MyUrls"]).then((data) => {
        MyUrls = data.MyUrls
        if (MyUrls != undefined){
            if (MyUrls.includes(location.hostname)){
                // if location.hostname is in MuUrls replace it 
                document.head.innerHTML = generateSTYLES();
                document.body.innerHTML = generateHTML();
            }
        }
    });
}
// main function that executes a specific function based on if the timer is on or not
function block(){
    chrome.storage.sync.get(["set"]).then((result) => {
        storageTimeSet = result.set
        if (result.set != undefined){
            var countDownDate = new Date(storageTimeSet).getTime(); 
            var now = new Date().getTime();
            var distance = countDownDate - now;
            // if the time set is not zero
            if (storageTimeSet != 0){
                // once the timer is done tell the user
                if (distance < 0){
                    chrome.notifications.create('timer is done', {
                        type: 'basic',
                        iconUrl: 'trans-logo.png',
                        title: '-- Block --',
                        message: 'The Timer is Done!',
                        priority: 1
                    })
                    chrome.storage.sync.set({ set: 0 })

                    return
                }
                // else block all the websites in the blocklist for the time set
                else {
                    // get the urls
                    chrome.storage.sync.get(["MyUrls"]).then((data) => {
                        MyUrls = data.MyUrls
                        if (MyUrls != undefined){
                            // if location.hostname is in MuUrls replace it 
                            if (MyUrls.includes(location.hostname)){
                                document.head.innerHTML = generateSTYLES();
                                document.body.innerHTML = generateHTML();
                            }
                        }
                    });
                }
            }
            else{
                // execute the socialsAlert function
                socialsAlert()
            }
        }
    })
}
// check every one second
setInterval(block, 1000);

