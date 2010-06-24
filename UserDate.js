/*global TimeZone*/

// Written by Grant Wilson. Meant to replace javascript's Date class when the user needs to change time zones. 
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
        date = new Date(jsDate.getTime());
        date.setTime(date.getTime() - (date.getTimezoneOffset() * oneMinuteMs));
        this.date = date;
    }
    this.tz = TimeZone.FromBrowser();
    this.adjustReverse();
    if (tz !== undefined) {
        this.tz = tz;
    }
}

// Changes to the given TimeZone.
UserDate.prototype.changeTimeZone = function (tz) {
    this.tz = tz;
    this.adjustReverse();
};

// Changes to the given date.
UserDate.prototype.changeDate = function (d) {
    var date = d;
    date.setTime(date.getTime() - (date.getTimezoneOffset() * oneMinuteMs));
    this.date = date;
};

//----------------GET------------------

// Gets the date according to the set time zone.
UserDate.prototype.getDate = function () {
    return this.adjustDate().getUTCDate();
};

//Gets the day according the the set time zone.
UserDate.prototype.getDay = function () {
    return this.adjustDate().getDay();
};

// Gets the full year according to the set time zone.
UserDate.prototype.getFullYear = function () {
    return this.adjustDate().getUTCFullYear();
};

// Gets the hours according to the set time zone.
UserDate.prototype.getHours = function () {
    return this.adjustDate().getUTCHours();
};

// Gets the milliseconds according to the set time zone.
UserDate.prototype.getMilliseconds = function () {
    return this.date.getUTCMilliseconds();
};

// Gets the minutes according to the set time zone.
UserDate.prototype.getMinutes = function () {
    return this.adjustDate().getUTCMinutes();
};

// Gets the month according to the set time zone.
UserDate.prototype.getMonth = function () {
    return this.adjustDate().getUTCMonth();
};

// Gets the seconds according to the set time zone.
UserDate.prototype.getSeconds = function () {
    return this.date.getUTCSeconds();
};

// Gets the seconds that have passed since Jan. 1st, 1970 UTC.
UserDate.prototype.getTime = function () {
    return (this.date.getTime() + (this.date.getTimezoneOffset() * oneMinuteMs));
};

// Gets the time zone offset from UTC.
UserDate.prototype.getTimezoneOffset = function () {
    var num;
    num = this.adjustDate().getTime() - this.date.getTime();
    return (num / 60000);
};

//-----------------GETUTC------------------

UserDate.prototype.getUTCDate = function () {
    return this.date.getUTCDate();
};

UserDate.prototype.getUTCDay = function () {
    return this.date.getUTCDay();
};

UserDate.prototype.getUTCFullYear = function () {
    return this.date.getUTCFullYear();
};

UserDate.prototype.getUTCHours = function () {
    return this.date.getUTCHours();
};

UserDate.prototype.getUTCMilliseconds = function () {
    return this.date.getUTCMilliseconds();
};

UserDate.prototype.getUTCMinutes = function () {
    return this.date.getUTCMinutes();
};

UserDate.prototype.getUTCMonth = function () {
    return this.date.getUTCMonth();
};

UserDate.prototype.getUTCSeconds = function () {
    return this.date.getUTCSeconds();
};

//--------------SET---------------------

UserDate.prototype.setDate = function (num) {
    this.date.setDate(num);
}

UserDate.prototype.setFullYear = function (num) {
    this.date.setFullYear(num);
}

UserDate.prototype.setHours = function (num) {
    this.date.setHours(num);
}

UserDate.prototype.setMilliseconds = function (num) {
    this.date.setMilliseconds(num);
}

UserDate.prototype.setMinutes = function (num) {
    this.date.setMinutes(num);
}

UserDate.prototype.setMonths = function (num) {
    this.date.setMonths(num);
}

UserDate.prototype.setSeconds = function (num) {
    this.date.setSeconds(num);
}

//---------------TO----------------

// Converts the date portion of a UserDate object into a readable string.
UserDate.prototype.toDateString = function () {
    return this.adjustDate().toDateString();
}

UserDate.prototype.toLocaleDateString = function () {
    var date = new Date(this.adjustDate());
    date.setTime(date.getTime() + (date.getTimezoneOffset() * oneMinuteMs));
    return date.toLocaleDateString();
}

UserDate.prototype.toLocaleTimeString = function () {
    var date = new Date(this.adjustDate());
    date.setTime(date.getTime() + (date.getTimezoneOffset() * oneMinuteMs));
    return date.toLocaleTimeString();
}

UserDate.prototype.toLocaleString = function () {
    var date = new Date(this.adjustDate());
    date.setTime(date.getTime() + (date.getTimezoneOffset() * oneMinuteMs));
    return date.toLocaleString();
}

UserDate.prototype.toString = function () {
    return this.adjustDate().toUTCString();
}

UserDate.prototype.toTimeString = function () {
    var date = new Date(this.adjustDate());
    date.setTime(date.getTime() + (date.getTimezoneOffset() * oneMinuteMs));
    return date.toTimeString();
}

// Converts a UserDate object to a string, according to universal time
UserDate.prototype.toUTCString = function () {
    return (this.date.toUTCString());
};

// Converts a UserDate object to a string, according to local time
UserDate.prototype.toLocalString = function () {
    return this.adjustDate().toUTCString();
};

//----------------MISC-----------------

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

UserDate.prototype.adjustBack = function () {
    var date = new Date(this.date.getTime());
    date.setTime(date.getTime() - (this.tz.GmtOffsetHours * oneHourMs));
    if (this.tz.UseDST) {
        if (date.getTime() >= this.getDSTStartDate().getTime() && date.getTime() < this.getDSTEndDate().getTime()) {
            date.setTime(date.getTime() - (oneHourMs * this.tz.DSTOffset));
        }
    }
    return date;
}

UserDate.prototype.adjustReverse = function () {
    var date = this.date;
    date.setTime(date.getTime() - (this.tz.GmtOffsetHours * oneHourMs));
    if (this.tz.UseDST) {
        if (date.getTime() >= this.getDSTStartDate().getTime() && date.getTime() < this.getDSTEndDate().getTime()) {
            date.setTime(date.getTime() - (oneHourMs * this.tz.DSTOffset));
        }
    }
}

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


//-------------------UTIL----------------------

// determines if a date is on the exact same date (not necessarily the same time)
UserDate.prototype.isSameDate = function (ud) {
    var rtn = false;
    if (this.getUTCFullYear() === ud.getUTCFullYear() &&
         this.getUTCMonth() === ud.getUTCMonth() &&
         this.getUTCDate() === ud.getUTCDate()) {
        rtn = true;
    }
    return rtn;
};

// convert local date to UTC
UserDate.prototype.localToUTC = function (tz) {
    // get local timezone offset
    if (tz === null) { tz = TimeZone.FromBrowser(); }
    var localNow = new Date(new Date(), tz);
    var offsetMinutes = localNow.getTimezoneOffset();
    return this.addMinutes(offsetMinutes);
};

// calculates difference between two dates in terms of hours
UserDate.prototype.hoursDifference = function (d) {
    var milliDiff = this.utcSecsSince1970() - d.utcSecsSince1970();
    var hrs = (milliDiff / (1000 * 60 * 60)) * 10 / 10;
    return hrs;
};

UserDate.prototype.utcSecsSince1970 = function () {
    return Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds());
};

//adds n days to the date and returns a new userdate object for the result
UserDate.prototype.addDays = function (n) {
    return new UserDate(this.utcSecsSince1970() + (oneDayMs * n), this.tz);
};

//adds n minutes to the date and returns a new date object for the result
UserDate.prototype.addMinutes = function (n) {
    return new UserDate(this.utcSecsSince1970() + (oneMinuteMs * n), this.tz);
};

UserDate.prototype.firstDayOfWeek = function () {
    return this.addDays(-1 * this.getDay());
};

UserDate.prototype.lastDayOfWeek = function () {
    return this.addDays(6 - this.getDay());
};

UserDate.prototype.timeInMs = function () {
    return (this.getHours() * oneHourMs) + (this.getMinutes() * oneMinuteMs) + (this.getSeconds() * oneSecondMs);
};

UserDate.prototype.startOfDay = function () {
    this.setMilliseconds(0);
    this.setTime(this.getTime() + (-1 * this.timeInMs()));
    return this;
};

UserDate.prototype.endOfDay = function () {
    this.setMilliseconds(0);
    this.setTime(this.getTime() + ((24 * oneHourMs) - this.timeInMs() - oneSecondMs));
    return this;
};

// gets the first time of the week for tasks
UserDate.prototype.startOfWeek = function (d) {
    return this.firstDayOfWeek().startOfDay();
};

// gets the last time of the week for tasks
UserDate.prototype.endOfWeek = function (d) {
    return this.lastDayOfWeek().endOfDay();
};

UserDate.prototype.formatWeekRange = function (firstFormat, secondFormat) {
    var startDate = this.firstDayOfWeek();
    var endDate = this.lastDayOfWeek();
    var startDateText = '';
    if (startDate.getFullYear() !== endDate.getFullYear()) {
        startDateText = startDate.format(secondFormat);
    } else {
        startDateText = startDate.format(firstFormat);
    }
    var endDateText = endDate.format(secondFormat);

    return startDateText + " - " + endDateText;
};

UserDate.prototype.format = function (formatTxt) {
    return $.datepicker.formatDate(formatTxt, this);
};

function toIntegersAtLease(n)
{ return n < 10 ? '0' + n : n; }

// Convert to UTC and return in ISO string Format
UserDate.prototype.toUTC_ISO = function () {
    return '"' + this.getUTCFullYear() + '-' +
    toIntegersAtLease(this.getUTCMonth() + 1) + '-' +
    toIntegersAtLease(this.getUTCDate()) + 'T' +
    toIntegersAtLease(this.getUTCHours()) + ':' +
    toIntegersAtLease(this.getUTCMinutes()) + ':' +
    toIntegersAtLease(this.getUTCSeconds()) + '"';
};