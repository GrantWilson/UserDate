/*global TimeZone*/
// Generic UserDate class for JQuery
// getTimezoneOffset includes DST if local region uses it/is using it
// One known bug shows up in a very rare case. If the browser's default time
// zone doesn't use DST, then the getDSTEndDate function will return a date an hour off
// from the actual crossover time. 

var oneSecondMs = 1000;
var oneMinuteMs = oneSecondMs * 60;
var oneHourMs = oneMinuteMs * 60;
var oneDayMs = oneHourMs * 24;

// Constructor: Uses given Date and TimeZone, defaults to current date and browser-given TimeZone.
function UserDate(jsDate, tz) {
    var date;
    if (jsDate === undefined) {
        date = new Date();
        date.setTime(date.getTime() - (date.getTimezoneOffset() * oneMinuteMs));
        this.date = date;
    }
    else {
        date = jsDate;
        date.setTime(date.getTime() - (date.getTimezoneOffset() * oneMinuteMs));
        this.date = date;
    }
    if (tz === undefined) {
        this.tz = TimeZone.FromBrowser();
    }
    else {
        this.tz = tz;
    }
}

// Changes to the given TimeZone.
UserDate.prototype.changeTimeZone = function (tz) {
    this.tz = tz;
};

// Changes to the given date.
UserDate.prototype.changeDate = function (d) {
    var date = d;
    date.setTime(date.getTime() - (date.getTimezoneOffset() * oneMinuteMs));
    this.date = date;
};

// Gets the full year according to the set time zone.
UserDate.prototype.getFullYear = function () {
    return this.adjustDate().getUTCFullYear();
};

// Gets the month according to the set time zone.
UserDate.prototype.getMonth = function () {
    return this.adjustDate().getUTCMonth();
};

// Gets the date according to the set time zone.
UserDate.prototype.getDate = function () {
    return this.adjustDate().getUTCDate();
};

// Gets the hours according to the set time zone.
UserDate.prototype.getHours = function () {
    return this.adjustDate().getUTCHours();
};

// Gets the minutes according to the set time zone.
UserDate.prototype.getMinutes = function () {
    return this.adjustDate().getUTCMinutes();
};

// Gets the seconds according to the set time zone.
UserDate.prototype.getSeconds = function () {
    return this.date.getUTCSeconds();
};

// Gets the milliseconds according to the set time zone.
UserDate.prototype.getMilliseconds = function () {
    return this.date.getUTCMilliseconds();
};

// Converts a UserDate object to a string, according to universal time
UserDate.prototype.toUTCString = function () {
    return (this.date.toUTCString());
};

// Converts a UserDate object to a string, according to local time
UserDate.prototype.toLocalString = function () {
    return this.adjustDate().toUTCString();
};

// A helper method that adjusts the date using the timezone offset and daylight savings time
UserDate.prototype.adjustDate = function () {
    var date = new Date(this.date.getTime());
    date.setTime(date.getTime() + (this.tz.GmtOffsetHours * oneHourMs));
    if (this.tz.UseDST) {
        if (date.getTime() >= this.getDSTStartDate().getTime() && date.getTime() < this.getDSTEndDate().getTime()) {
            date.setTime(date.getTime() + (oneHourMs * this.tz.DSTOffset));
        }
    }
    return date;
};

// Returns the start date of dst based on the time zone. This method and the following one
// are in UserDate rather than TimeZone because the start and end dates of DST are often based
// on a day (e.g. second Sunday of March), and so the function needs to know the year.
UserDate.prototype.getDSTStartDate = function () {
    var startDate = null;
    switch (this.tz.Name) {
        case "Central Time":
        case "Alaska Time":
        case "Pacific Time":
        case "Eastern Time":
        case "Mountain Time":
            var day1 = new Date(this.date.getUTCFullYear(), 2, 1, 12);
            if (day1.getDay() === 0) {
                startDate = new Date(this.date.getUTCFullYear(), 2, 8, 2 - (day1.getTimezoneOffset() / 60));
            }
            else {
                startDate = new Date(this.date.getUTCFullYear(), 2, 15 - day1.getUTCDay(), 2 - (day1.getTimezoneOffset() / 60));
            }
            return startDate;
    }
    return startDate;
};

// Returns the end date of dst based on the time zone.
UserDate.prototype.getDSTEndDate = function () {
    var endDate = null;
    switch (this.tz.Name) {
        case "Central Time":
        case "Alaska Time":
        case "Pacific Time":
        case "Eastern Time":
        case "Mountain Time":
            var day1 = new Date(this.date.getUTCFullYear(), 2, 1, 12);
            if (day1.getDay() === 0) {
                endDate = new Date(this.date.getUTCFullYear(), 10, 1, 2 - (day1.getTimezoneOffset() / 60));
            }
            else {
                endDate = new Date(this.date.getUTCFullYear(), 10, 8 - day1.getUTCDay(), 2 - (day1.getTimezoneOffset() / 60));
            }
            return endDate;
    }
    return endDate;
};