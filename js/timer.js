var language = $("html").attr("lang");

$(document).ready(function() {
  loadConfig(function(config) {
    var date = new Date(config.keywords.secret.time);
    function secretLoader() {
      var now = Date.now();
      if (date.valueOf() <= now) {
        $("#hide-after-reveal").css("display", "none");
      } else {
        var useRelative = date - now < 3600000;

        var prefix = getPrefix(language, useRelative);

        var timeString = date.toLocaleDateString(language, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
        if (useRelative) {
          timeString = formatRemainingTime(date - now);
        }

        document.getElementById("secret-timer").textContent =
          prefix + " " + timeString;
        window.requestAnimationFrame(secretLoader);
      }
    }
    requestAnimationFrame(secretLoader);
  });
});

function formatRemainingTime(milliseconds) {
  var minutes = Math.floor(milliseconds / 60 / 1000);
  var seconds = Math.floor((milliseconds / 1000) % 60);
  var ms = Math.floor((milliseconds % 1000) / 10);
  if (!minutes) {
    return leftPad(seconds) + ":" + leftPad(ms);
  } else {
    return leftPad(minutes) + ":" + leftPad(seconds);
  }
}

function leftPad(number) {
  return number.toString().length < 2 ? "0" + number : number;
}

function getPrefix(language, relative) {
  if (relative) {
    return "in";
  }

  if (language === "de-DE") {
    return "am";
  } else {
    return "on";
  }
}
