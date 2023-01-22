// the graph/canvas
const ctx = document.getElementById('myChart');
// height of the canvas
ctx.height = 250
// to store the tasks done
var TasksDone = []
// to store the classified number of tasks done as per type and day of the week
let week = [
    {type1: 3, type2: 0, type3: 1},
    {type1: 0, type2: 2, type3: 0},
    {type1: 1, type2: 0, type3: 2},
    {type1: 0, type2: 0, type3: 0},
    {type1: 0, type2: 0, type3: 0},
    {type1: 0, type2: 0, type3: 0},
    {type1: 0, type2: 0, type3: 0}
]
// to store the focus time slots
var focusTimeSlot = []
// to store the the time spent each day
let focusTime = [
    {time: 1},
    {time: 2},
    {time: 0.5},
    {time: 0},
    {time: 0},
    {time: 0},
    {time: 0}
]
// when the stats page loads
window.onload = function() {
    // get the tasks done
    chrome.storage.sync.get(["taskdone"]).then((data) => {
        TasksDone = data.taskdone
        let i = 0
        if (TasksDone != undefined){
            // loop over all the tasks done and classify each of them and store in week[]
            while (i < TasksDone.length){
                let day = week[TasksDone[i].day];
                if (TasksDone[i].type === 1){
                    day.type1++
                }
                else if (TasksDone[i].type === 2){
                    day.type2++
                }
                else if (TasksDone[i].type === 3){
                    day.type3++
                }
                i++
            }
        }
        // get the focus time slots
        chrome.storage.sync.get(["focusTimeSlots"]).then((data) => {
            focusTimeSlot = data.focusTimeSlots
            let i = 0
            if (focusTimeSlot != undefined){
                // loop ove all the focus time slots and add them, then classify per day
                while (i < focusTimeSlot.length){
                    let day = focusTime[focusTimeSlot[i].day]
                    let time = focusTimeSlot[i].time
                    // store as hours
                    day.time = Math.round((day.time + time/3600000)*10) / 10
                    i++
                }
            }
            const d = new Date();
            let day = d.getDay()
            // when the week ends, erase and start again
            if (day === 0 && focusTime[6] || week[6].type1 || week[6].type2 || week[6].type3 != 0){
                chrome.storage.sync.set({taskdone :[]});
                chrome.storage.sync.set({focusTimeSlots :[]});
            }
            //start the graph() function
            graph()
        })
    })
}
// this function plots the graph
// most of the code here was taken from chart js -- https://www.chartjs.org/docs/latest/getting-started/ 
function graph(){
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
        label: 'Personnel Tasks',
        // display the personnel tasks completed each day
        data: [week[0].type1, week[1].type1, week[2].type1, week[3].type1, week[4].type1, week[5].type1, week[6].type1],
        backgroundColor: [
            'rgba(245, 187, 0, 0.7)'
        ],
        borderColor: [
            'rgba(245, 187, 0, 1)'
        ],
        borderWidth: 1,
        order: 2
        },{
            label: 'Work Tasks',
            // display the work related tasks each day
            data: [week[0].type2, week[1].type2, week[2].type2, week[3].type2, week[4].type2, week[5].type2, week[6].type2],
            backgroundColor: [
            'rgba(242, 66, 54, 0.7)'
            ],
            borderColor: [
            'rgba(242, 66, 54, 1)'
            ],
            borderWidth: 1,
            order: 2
        },{
            label: 'Chores',
            // display the chores completed each day
            data: [week[0].type3, week[1].type3, week[2].type3, week[3].type3, week[4].type3, week[5].type3, week[6].type3],
            backgroundColor: [
            'rgba(46, 134, 171, 0.7)'
            ],
            borderColor: [
            'rgba(46, 134, 171, 1)'
            ],
            borderWidth: 1,
            order: 2
        },{
            // display the focus time as a line graph
            label: 'Focus Time',
            data: [focusTime[0].time, focusTime[1].time, focusTime[2].time, focusTime[3].time, focusTime[4].time, focusTime[5].time, focusTime[6].time],
            fill: false,
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1.5,
            tension: 0.4,
            type: 'line',
            order: 1
        }]
    },
    options: {
        scales: {
        x: {
            stacked: true
        },
        y: {
            max: 10,
            beginAtZero: true,
            stacked: true,
            ticks: {
                stepSize: 1
            }
        }
        }
    }
    });
}