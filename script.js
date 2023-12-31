getStringDate = (date) => {
    let year = date.getFullYear().toString();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return year[2] + year[3] + "/" + month + "/" + day
}

reverseStringDate = (date) => {
    return date[6] + date[7] + "/" + date[3] + date[4] + "/" + date[0] + date[1]
}

createTask = (subject, task) => {
    return {subject, task};
}

createTaskElement = (task, date) => {
    div = document.createElement("li");
    div.className = "task";
    p1 = document.createElement("p");
    p1.className = "subject"
    p2 = document.createElement("span");
    p2.className = "content"
    p1.innerText = task.subject + ": ";
    p2.innerText = task.task;
    if (date) {
        dateElement = document.createElement("p");
        dateElement.className = "date"
        dateElement.innerText = reverseStringDate(date) + " - ";
        div.appendChild(dateElement);
    }
    p1.appendChild(p2);
    div.appendChild(p1);
    return div;
}

let url = "https://raw.githubusercontent.com/RandomCoder59/HomeworkApp/main/data.json";
let data = {};
let todayDate = getStringDate(new Date());
let todayList = document.getElementById("today-tasks");
let upcomingList = document.getElementById("upcoming-or-previous-tasks");
let previousButton = document.getElementById("previous");
let upcomingButton = document.getElementById("upcoming");
let fitlerSelect = document.getElementById("filter")

document.onload = () => {
    let loaders = document.querySelectorAll(".loader");
    for (let loader of loaders) {
        loader.remove();
    }
    todayDate = getStringDate(new Date());
    todayTasks = data[todayDate];
    if (todayTasks && todayTasks.length > 0) {
        for (let task of todayTasks) {
            todayList.appendChild(createTaskElement(task));
        }
    } else {
        todayList.appendChild(createTaskElement(createTask("General", "Check upcoming tasks")))
    }
    upcomingButton.click();
}

previousButton.onclick = () => {
    previousButton.className = "checked";
    upcomingButton.className = "";
    upcomingList.innerHTML = "";
    let dates = [];
    for (let date of Object.keys(data)) {
        if (date < todayDate) {
            dates.push(date);
        }
    }
    dates.sort();
    dates.reverse();
    for (let date of dates) {
        for (let task of data[date]) {
            if (fitlerSelect.value == "All" || fitlerSelect.value == task.subject) {
                upcomingList.appendChild(createTaskElement(task, date));
            }
        }
    }
}

upcomingButton.onclick = () => {
    upcomingButton.className = "checked";
    previousButton.className = "";
    upcomingList.innerHTML = "";
    let dates = [];
    for (let date of Object.keys(data)) {
        if (date > todayDate) {
            dates.push(date);
        }
    }
    dates.sort();
    for (let date of dates) {
        for (let task of data[date]) {
            if (fitlerSelect.value == "All" || fitlerSelect.value == task.subject) {
                upcomingList.appendChild(createTaskElement(task, date));
            }
        }
    }
}

fitlerSelect.onchange = () => {
    if (upcomingButton.className == "checked") {
        upcomingButton.click()
    } else {
        previousButton.click()
    }
}

fetch(url)
.then(res => res.json())
.then(out => {
    data = out;
    document.onload();
})
.catch(err => {
    console.log(err);
    alert("Unable to load tasks! Kindly refresh!");
});
