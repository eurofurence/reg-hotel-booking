var language = $("html").attr("lang");

$(document).ready(function() {
  loadConfig(function(config) {
    function loadTime() {
      $.ajax(config.timeServer, {
        cache: false,
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

                var timeString = new Date(
                  timeResponse.targetTime
                ).toLocaleDateString(language, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });
                if (useRelative) {
                  timeString = formatRemainingTime(end - now);
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
