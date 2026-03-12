const fs = require("fs"); //helper methods
function timeToSeconds(timeStr) {
    let parts = timeStr.trim().split(" ")
    let timePart = parts[0]
    let period = parts[1].toLowerCase()

    let timePieces = timePart.split(":")
    let hours = parseInt(timePieces[0])
    let minutes = parseInt(timePieces[1])
    let seconds = parseInt(timePieces[2])

    if (period == "am") {
        if (hours == 12) {
            hours = 0
        }
    }
    else if (period == "pm") {
        if (hours != 12) {
            hours += 12
        }
    }

    return hours * 3600 + minutes * 60 + seconds
}

function durationToSeconds(time) {
    let parts = time.trim().split(":")
    let h = parseInt(parts[0])
    let m = parseInt(parts[1])
    let s = parseInt(parts[2])

    return h * 3600 + m * 60 + s
}

function secondsToDuration(totalSeconds) {
    let h = Math.floor(totalSeconds / 3600)
    let m = Math.floor((totalSeconds % 3600) / 60)
    let s = totalSeconds % 60

    return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
}
// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) { //replaced with simplified helper method
let startSeconds = timeToSeconds(startTime)
    let endSeconds = timeToSeconds(endTime)
    let durationSeconds = endSeconds - startSeconds

    return secondsToDuration(durationSeconds)
}


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) { //replaced with simplified helper method
   let startSeconds = timeToSeconds(startTime)
    let endSeconds = timeToSeconds(endTime)

    let deliveryStart = 8 * 3600
    let deliveryEnd = 22 * 3600

    let idleSeconds = 0

    if (startSeconds < deliveryStart) {
        idleSeconds += deliveryStart - startSeconds
    }

    if (endSeconds > deliveryEnd) {
        idleSeconds += endSeconds - deliveryEnd
    }

    return secondsToDuration(idleSeconds)
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================

// TODO: Implement this functio
function getActiveTime(shiftDuration, idleTime) {
     let shiftSeconds = durationToSeconds(shiftDuration)
    let idleSeconds = durationToSeconds(idleTime)
    let activeSeconds = shiftSeconds - idleSeconds

    return secondsToDuration(activeSeconds)
}


// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
     let activeSeconds = durationToSeconds(activeTime)

    let normalQuota = 8 * 3600 + 24 * 60
    let eidQuota = 6 * 3600

    if (date >= "2025-04-10" && date <= "2025-04-30") {
        return activeSeconds >= eidQuota
    }
    else {
        return activeSeconds >= normalQuota
    }
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {

    let data = fs.readFileSync(textFile, "utf8")
    let lines = data.trim().split("\n")
    let header = lines[0]
    let records = lines.slice(1)
    for (let i = 0; i < records.length; i++) {
        let parts = records[i].split(",")
        let driverID = parts[0]
        let date = parts[2]

        if (driverID == shiftObj.driverID && date == shiftObj.date) {
            return {}
        }
    }
    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime)
    let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime)
    let activeTime = getActiveTime(shiftDuration, idleTime)
    let quotaMet = metQuota(shiftObj.date, activeTime)
    let hasBonus = false
    let newObj = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idleTime,
        activeTime: activeTime,
        metQuota: quotaMet,
        hasBonus: hasBonus
    }
    let newLine =
        newObj.driverID + "," + //because csv format all need comma after, idk if spaces matter so no spaces to stay in safe side?
        newObj.driverName + "," +
        newObj.date + "," +
        newObj.startTime + "," +
        newObj.endTime + "," +
        newObj.shiftDuration + "," +
        newObj.idleTime + "," +
        newObj.activeTime + "," +
        newObj.metQuota + "," +
        newObj.hasBonus

    let lastIndex = -1

    for (let i = 0; i < records.length; i++) {
        let parts = records[i].split(",")
        if (parts[0] == shiftObj.driverID) {
            lastIndex = i
        }
    }
    if (lastIndex == -1) {
        records.push(newLine)
    }
    else {
        records.splice(lastIndex + 1, 0, newLine)
    }
    let finalData = header + "\n" + records.join("\n")
    fs.writeFileSync(textFile, finalData)
    return newObj
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

    let data = fs.readFileSync(textFile, "utf8")
    let lines = data.trim().split("\n")

    for (let i = 1; i < lines.length; i++) {
        let parts = lines[i].split(",")

        if (parts[0] == driverID && parts[2] == date) {
            parts[9] = String(newValue)
            lines[i] = parts.join(",")
            break
        }
    }

    fs.writeFileSync(textFile, lines.join("\n"))
}


// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    let data = fs.readFileSync(textFile, "utf8")
    let lines = data.trim().split("\n")
    let targetMonth = String(parseInt(month))
    let driverExists = false
    let count = 0



    for (let i = 1; i < lines.length; i++) {
        let parts = lines[i].trim().split(",")
        let currentDriverID = parts[0].trim()
        let currentDate = parts[2].trim()
        let hasBonus = parts[9].trim()
        let currentMonth = String(parseInt(currentDate.split("-")[1]))
        if (currentDriverID == driverID) {
            driverExists = true
            if (currentMonth == targetMonth && hasBonus == "true") {
                count++
            }
        }
    }
    if (driverExists == false) {
        return -1
    }
    return count
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    let data = fs.readFileSync(textFile, "utf8")
    let lines = data.trim().split("\n")

    let totalSeconds = 0

    for (let i = 1; i < lines.length; i++) {
        let parts = lines[i].trim().split(",")

        let currentDriverID = parts[0].trim()
        let currentDate = parts[2].trim()
        let activeTime = parts[7].trim()

        let currentMonth = parseInt(currentDate.split("-")[1])

        if (currentDriverID == driverID && currentMonth == month) {
            totalSeconds += durationToSeconds(activeTime)
        }
    }

    return secondsToDuration(totalSeconds)
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
    // function secondsToDuration(totalSeconds) {
    //     let h = Math.floor(totalSeconds / 3600)
    //     let m = Math.floor((totalSeconds % 3600) / 60)
    //     let s = totalSeconds % 60

    //     return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
    // }

    let shiftData = fs.readFileSync(textFile, "utf8")
    let shiftLines = shiftData.trim().split("\n")

    let rateData = fs.readFileSync(rateFile, "utf8")
    let rateLines = rateData.trim().split("\n")

    let dayOff = ""

    for (let i = 1; i < rateLines.length; i++) {
        let parts = rateLines[i].trim().split(",")

        if (parts[0].trim() == driverID) {
            dayOff = parts[1].trim()
            break
        }
    }

    let totalRequiredSeconds = 0

    for (let i = 1; i < shiftLines.length; i++) {
        let parts = shiftLines[i].trim().split(",")

        let currentDriverID = parts[0].trim()
        let currentDate = parts[2].trim()

        let currentMonth = parseInt(currentDate.split("-")[1])

        if (currentDriverID == driverID && currentMonth == month) {

            let currentDayName = new Date(currentDate).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })

            if (currentDayName != dayOff) {

                if (currentDate >= "2025-04-10" && currentDate <= "2025-04-30") {
                    totalRequiredSeconds += 6 * 3600
                }
                else {
                    totalRequiredSeconds += 8 * 3600 + 24 * 60
                }

            }
        }
    }

    totalRequiredSeconds -= bonusCount * 2 * 3600

    if (totalRequiredSeconds < 0) {
        totalRequiredSeconds = 0
    }

    return secondsToDuration(totalRequiredSeconds)

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
let data = fs.readFileSync(rateFile, "utf8")
    let lines = data.trim().split("\n")

    let basePay = 0
    let tier = 0

    // for(let i = 1; i < lines.length; i++){ start from 0 not 1 because of header
    for (let i = 0; i < lines.length; i++) {
        let parts = lines[i].trim().split(",")

        if (parts[0].trim() == driverID) {
            basePay = parseInt(parts[2])
            tier = parseInt(parts[3])
            break
        }
    }

    let actualSeconds = durationToSeconds(actualHours)
    let requiredSeconds = durationToSeconds(requiredHours)

    if (actualSeconds >= requiredSeconds) {
        return basePay
    }

    let missingSeconds = requiredSeconds - actualSeconds
    let missingHours = Math.floor(missingSeconds / 3600)
    let allowedHours = 0

    if (tier == 1) {
        allowedHours = 50
    }
    else if (tier == 2) {
        allowedHours = 20
    }
    else if (tier == 3) {
        allowedHours = 10
    }
    else if (tier == 4) {
        allowedHours = 3
    }

    let billableMissingHours = missingHours - allowedHours

    if (billableMissingHours < 0) {
        billableMissingHours = 0
    }

    let deductionRatePerHour = Math.floor(basePay / 185)
    let salaryDeduction = billableMissingHours * deductionRatePerHour

    return basePay - salaryDeduction
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
