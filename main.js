const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
function timeToSeconds(timeStr) {
        let parts = timeStr.trim().split(" ");
        let timePart = parts[0];
        let period = parts[1].toLowerCase();

        let timePieces = timePart.split(":");
        let hours = parseInt(timePieces[0]);
        let minutes = parseInt(timePieces[1]);
        let seconds = parseInt(timePieces[2]);

        if (period === "am") {
            if (hours === 12) {
                hours = 0;
            }
        } else if (period === "pm") {
            if (hours !== 12) {
                hours += 12;
            }
        }

        return hours * 3600 + minutes * 60 + seconds;
    }

    function secondsToDuration(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        let minutesStr = String(minutes).padStart(2, "0");
        let secondsStr = String(seconds).padStart(2, "0");

        return hours + ":" + minutesStr + ":" + secondsStr;
    }

    let startSeconds = timeToSeconds(startTime);
    let endSeconds = timeToSeconds(endTime);
    let durationSeconds = endSeconds - startSeconds;

    return secondsToDuration(durationSeconds);
}


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
    function timeToSeconds(timeStr) {
        let parts = timeStr.trim().split(" ");
        let timePart = parts[0];
        let period = parts[1].toLowerCase();

        let timePieces = timePart.split(":");
        let hours = parseInt(timePieces[0]);
        let minutes = parseInt(timePieces[1]);
        let seconds = parseInt(timePieces[2]);

        if (period === "am") {
            if (hours === 12) {
                hours = 0;
            }
        } else {
            if (hours !== 12) {
                hours += 12;
            }
        }

        return hours * 3600 + minutes * 60 + seconds;
    }

    function secondsToDuration(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        return hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }

    let startSeconds = timeToSeconds(startTime);
    let endSeconds = timeToSeconds(endTime);

    let deliveryStart = 8 * 3600;   // 8 am
    let deliveryEnd = 22 * 3600;    // 10pm prolly

    let idleSeconds = 0;

    if (startSeconds < deliveryStart) {
        idleSeconds += deliveryStart - startSeconds;
    }

    if (endSeconds > deliveryEnd) {
        idleSeconds += endSeconds - deliveryEnd;
    }

    return secondsToDuration(idleSeconds);
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================

    // TODO: Implement this functio
    function getActiveTime(shiftDuration, idleTime) {
    function durationToSeconds(durationStr) {
        let parts = durationStr.trim().split(":");
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        let seconds = parseInt(parts[2]);
        return hours * 3600 + minutes * 60 + seconds;
    }

function secondsToDuration(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);        
    let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        return hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }
    let shiftSeconds = durationToSeconds(shiftDuration);
    let idleSeconds = durationToSeconds(idleTime);
    let activeSeconds = shiftSeconds - idleSeconds;
    return secondsToDuration(activeSeconds);
}


// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
