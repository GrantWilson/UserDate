// TimeZone object to store GMT hours offset and DST support
function TimeZone(settings) {
    this.Continent = settings.Continent;
    this.GmtOffsetHours = settings.GmtOffsetHours;
    this.GmtOffsetText = settings.GmtOffsetText;
    this.Name = settings.Name;
    this.Region = settings.Region;
    this.UseDST = settings.UseDST;
    this.DSTOffset = settings.DSTOffset;
}

// After adding a time zone, make sure to add it to UserDate's GetDSTStartDate and GetDSTEndDate.
TimeZone.SupportedZones =
    [
        { "Continent": "America",
            "GmtOffsetHours": -7,
            "GmtOffsetText": "GMT-07:00",
            "Name": "Mountain Time",
            "Region": "Denver",
            "UseDST": true,
            "DSTOffset": 1
        },
        { "Continent": "America",
            "GmtOffsetHours": -7,
            "GmtOffsetText": "GMT-07:00",
            "Name": "Mountain Time - Arizona",
            "Region": "Phoenix",
            "UseDST": false
        },
        { "Continent": "America",
            "GmtOffsetHours": -5,
            "GmtOffsetText": "GMT-05:00",
            "Name": "Eastern Time",
            "Region": "New_York",
            "UseDST": true,
            "DSTOffset": 1
        },
        { "Continent": "Pacific",
            "GmtOffsetHours": -10,
            "GmtOffsetText": "GMT-10:00",
            "Name": "Hawaii Time",
            "Region": "Honolulu",
            "UseDST": false
        },
        { "Continent": "America",
            "GmtOffsetHours": -8,
            "GmtOffsetText": "GMT-08:00",
            "Name": "Pacific Time",
            "Region": "Los_Angeles",
            "UseDST": true,
            "DSTOffset": 1
        },
        { "Continent": "America",
            "GmtOffsetHours": -9,
            "GmtOffsetText": "GMT-09:00",
            "Name": "Alaska Time",
            "Region": "Anchorage",
            "UseDST": true,
            "DSTOffset": 1
        },
        { "Continent": "America",
            "GmtOffsetHours": -6,
            "GmtOffsetText": "GMT-06:00",
            "Name": "Central Time",
            "Region": "Chicago",
            "UseDST": true,
            "DSTOffset": 1
        },   
        { "Continent": "America",
            "GmtOffsetHours": -6,
            "GmtOffsetText": "GMT-06:00",
            "Name": "Experiment Time",
            "Region": "Forgotten Realms",
            "UseDST": true,
            "DSTOffset": 2.25
        }
    ];

// convert timezone name to full timezone object
TimeZone.FromName = function (name) {
    var zones = TimeZone.SupportedZones;
    // lookup first in supported zones
    for (var i = 0; i < zones.length; i = i + 1) {
        var curSettings = zones[i];
        if (curSettings.Name === name) {
            return new TimeZone(curSettings);
        }
    }
};

// changes attributes of said timezone object to those of given timezone object.
// This way, any UserDates linked to the TimeZone will change, too.
TimeZone.prototype.ChangeTo = function (tz) {
    this.Continent = tz.Continent;
    this.GmtOffsetHours = tz.GmtOffsetHours;
    this.GmtOffsetText = tz.GmtOffsetText;
    this.Name = tz.Name;
    this.Region = tz.Region;
    this.UseDST = tz.UseDST;
    this.DSTOffset = tz.DSTOffset;
};

// convert gmt offsett and dst flag to full timezone object
TimeZone.FromOffset = function (gmtOffset, useDst) {
    var zones = TimeZone.SupportedZones;
    // lookup first in supported zones
    for (var i = 0; i < zones.length; i = i + 1) {
        var curSettings = zones[i];
        if (curSettings.UseDST === useDst && curSettings.GmtOffsetHours === gmtOffset) {
            return new TimeZone(curSettings);
        }
    }
};

// script adapted from Josh Fraser's post (http://www.onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/)
// static function to build TimeZone object from current browser settings
TimeZone.FromBrowser = function () {
    var rightNow = new Date();
    var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
    var july1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); // july 1st
    var temp = jan1.toGMTString();
    var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
    temp = july1.toGMTString();
    var july2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
    var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
    var daylight_time_offset = (july1 - july2) / (1000 * 60 * 60);
    var dst;
    if (std_time_offset === daylight_time_offset) {
        dst = false; // daylight savings time is NOT observed
    } else {
        // positive is southern, negative is northern hemisphere
        var hemisphere = std_time_offset - daylight_time_offset;
        if (hemisphere >= 0)
        { std_time_offset = daylight_time_offset; }
        dst = true; // daylight savings time is observed
    }

    // convert timzone settings to full timezone object
    return TimeZone.FromOffset(std_time_offset, dst);
};

TimeZone.prototype.DisplayString = function () {
    return '(' + this.GmtOffsetText + ')' + this.Name + ', dst=' + this.DstString();
};

TimeZone.prototype.DstString = function () {
    return this.UseDST ? "1" : "0";
};

TimeZone.prototype.OffsetString = function () {
    var value = this.GmtOffsetHours;
    var hours = parseInt(value, 10);
    value -= parseInt(value, 10);
    value *= 60;
    var mins = parseInt(value, 10);
    value -= parseInt(value, 10);
    value *= 60;
    var secs = parseInt(value, 10);
    var display_hours = hours;
    // handle GMT case (00:00)
    if (hours === 0) {
        display_hours = "00";
    } else if (hours > 0) {
        // add a plus sign and perhaps an extra 0
        display_hours = (hours < 10) ? "+0" + hours : "+" + hours;
    } else {
        // add an extra 0 if needed 
        display_hours = (hours > -10) ? "-0" + Math.abs(hours) : hours;
    }

    mins = (mins < 10) ? "0" + mins : mins;
    return display_hours + ":" + mins;
};