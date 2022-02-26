var language = $("html").attr("lang");

$(document).ready(function() {
  loadConfig(function(config) {
    function loadTime() {
      $.ajax(config.timeServer, {
        cache: false,
        xhrFields: {
          // Needed for local testing or if we introduce api.eurofurence.org at some point
          withCredentials: true
        },
        success: function(timeResponse) {
          $("#timeError").css("display", "none");
          if (timeResponse.countdown <= 0) {
            $("#hide-after-reveal").css("display", "none");
          } else {
            $("#hide-after-reveal").css("display", "block");
            var start = Date.now();
            var end = start + timeResponse.countdown * 1000;

            function countdownUpdater() {
              var now = Date.now();
              if (end <= now) {
                $("#hide-after-reveal").css("display", "none");
              } else {
                var useRelative = end - now < 3600000;

                var prefix = getPrefix(language, useRelative);

                var timeString = '';
                if (useRelative) {
                  timeString = formatRemainingTime(end - now);

                  $("#secret-timer-berlin-tz").css("display", "none");
                } else {
                  var targetTime = new Date(timeResponse.targetTime)
                  var timeFormat = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }

                  timeString = targetTime.toLocaleDateString(language, timeFormat);
                  var berlinTimeString = targetTime.toLocaleDateString(language, { ...timeFormat, timeZone: 'Europe/Berlin', timeZoneName: 'short' });

                  $("#secret-timer-berlin-tz").text(`(${berlinTimeString})`);
                  $("#secret-timer-berlin-tz").css("display", "block");
                }

                document.getElementById("secret-timer").textContent =
                  prefix + " " + timeString;
                setTimeout(function() {
                  window.requestAnimationFrame(countdownUpdater);
                }, 100);
              }
            }
            requestAnimationFrame(countdownUpdater);
          }
        },
        error: function() {
          $("#hide-after-reveal").css("display", "none");
          $("#timeError").css("display", "block");

          setTimeout(loadTime, 5000);
        }
      });
    }
    loadTime();
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
