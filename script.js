let freeTime = {};

function showFreeTimeInputs() {
    document.getElementById('free-time-inputs').style.display = 'block';
}

function confirmFreeTime() {
    freeTime = {
        monday: parseFloat(document.getElementById('monday').value) || 0,
        tuesday: parseFloat(document.getElementById('tuesday').value) || 0,
        wednesday: parseFloat(document.getElementById('wednesday').value) || 0,
        thursday: parseFloat(document.getElementById('thursday').value) || 0,
        friday: parseFloat(document.getElementById('friday').value) || 0,
        saturday: parseFloat(document.getElementById('saturday').value) || 0,
        sunday: parseFloat(document.getElementById('sunday').value) || 0,
    };
    document.getElementById('task-section').style.display = 'block';
}

function addTask() {
    const taskNameInput = document.getElementById('task-name');
    const taskName = taskNameInput.value;
    const taskDuration = parseFloat(document.getElementById('task-duration').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    let totalFreeTime = calculateTotalFreeTime(totalDays, startDate);
    let day = startDate;

    const allocation = calculateAllocation(taskDuration, totalFreeTime, totalDays, startDate);

    const table = document.getElementById('schedule');
    const thead = table.querySelector('thead tr');
    const newHeader = document.createElement('th');
    newHeader.innerText = taskName;
    thead.appendChild(newHeader);

    allocation.forEach((time, index) => {
        let dateStr = new Date(day.getTime() + index * (1000 * 60 * 60 * 24)).toDateString();
        let row = table.querySelector(`tbody tr[data-date="${dateStr}"]`);
        if (!row) {
            row = document.createElement('tr');
            row.setAttribute('data-date', dateStr);
            const dateCell = document.createElement('td');
            dateCell.innerText = dateStr;
            row.appendChild(dateCell);
            table.querySelector('tbody').appendChild(row);

            // Create empty cells for previous tasks to ensure alignment
            for (let i = 0; i < thead.children.length - 2; i++) { // Adjust for the date column
                const emptyCell = document.createElement('td');
                emptyCell.innerText = "";
                row.appendChild(emptyCell);
            }
        }
        const cell = document.createElement('td');
        cell.innerText = formatTime(time);  // Format the time as hours and minutes
        row.appendChild(cell);
    });

    // Add empty cells for the extra days where this task doesn't exist (if it has fewer days)
    const extraRows = totalDays - allocation.length;
    if (extraRows > 0) {
        for (let i = 0; i < extraRows; i++) {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            row.appendChild(dateCell); // Empty date cell
            for (let j = 0; j < thead.children.length - 1; j++) {
                const emptyCell = document.createElement('td');
                emptyCell.innerText = ""; // Empty task cells
                row.appendChild(emptyCell);
            }
            table.querySelector('tbody').appendChild(row);
        }
    }

    // Clear task name field but keep other inputs as they are
    taskNameInput.value = '';

    document.getElementById('schedule-table').style.display = 'block';
}

function calculateTotalFreeTime(totalDays, startDate) {
    let totalFreeTime = 0;
    for (let i = 0; i < totalDays; i++) {
        const dayOfWeek = (startDate.getDay() + i) % 7;
        totalFreeTime += getFreeTimeForDay(dayOfWeek);
    }
    return totalFreeTime;
}

function calculateAllocation(taskDuration, totalFreeTime, totalDays, startDate) {
    const allocation = [];
    for (let i = 0; i < totalDays; i++) {
        const dayOfWeek = (startDate.getDay() + i) % 7;
        const freeTimeForDay = getFreeTimeForDay(dayOfWeek);
        const proportion = freeTimeForDay / totalFreeTime;
        allocation.push(taskDuration * proportion);
    }
    return allocation;
}

function getFreeTimeForDay(dayOfWeek) {
    switch (dayOfWeek) {
        case 0: return freeTime.sunday || 0;
        case 1: return freeTime.monday || 0;
        case 2: return freeTime.tuesday || 0;
        case 3: return freeTime.wednesday || 0;
        case 4: return freeTime.thursday || 0;
        case 5: return freeTime.friday || 0;
        case 6: return freeTime.saturday || 0;
        default: return 0;
    }
}

// Format time in hours and minutes
function formatTime(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours > 0 ? hours + ' hr' + (hours > 1 ? 's' : '') : ''}${hours > 0 && minutes > 0 ? ' ' : ''}${minutes > 0 ? minutes + ' min' : ''}`;
}