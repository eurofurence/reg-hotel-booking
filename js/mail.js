var language = $("html").attr("lang");

$(document).ready(function() {
  loadConfig(function(config) {
    loadTemplate(config.mail.template, function(template) {
      render(config, template);
      loadTime(config, template);
    });
  });
});

function render(config, template) {
  var compiledData = compileData(config);

  Mustache.escape = function(text) {
    return text;
  };

  var body = Mustache.render(template, compiledData);
  var subject = Mustache.render(config.mail.subject, compiledData);

  $("#email").text(body);
  $("#email_to").val(config.mail.recipient);
  $("#email_subject").val(subject);
  $("#ready-text-start").attr(
    "href",
    "mailto:" +
      config.mail.recipient +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
  );

  $("#ready-text-copyTo").click(
    { textSource: document.getElementById("email_to") },
    copyMailContents
  );
  $("#ready-text-copySubject").click(
    { textSource: document.getElementById("email_subject") },
    copyMailContents
  );
  $("#ready-text-copyBody").click(
    { textSource: document.getElementById("email") },
    copyMailContents
  );
}

function loadTime(config, template) {
  $.ajax(config.timeServer, {
    success: function(timeResponse) {
      $("#timeError").css("display", "none");
      if (timeResponse.secret) {
        config.keywords.secret = timeResponse.secret;
        render(config, template);
        $("#countdown-text").remove();
        $("#ready-text").css("display", "block");
      } else {
        var start = Date.now();
        var end = start + timeResponse.countdown * 1000;

        function countdownUpdater() {
          var now = Date.now();
          if (end <= now) {
            $("#secret-timer").text(getText("loading"));
            loadTime(config, template);
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
            window.requestAnimationFrame(countdownUpdater);
          }
        }
        requestAnimationFrame(countdownUpdater);
      }
    },
    error: function() {
      $("#timeError").css("display", "block");

      setTimeout(function() {
        loadTime(config, template);
      }, 5000);
    }
  });
}

function copyMailContents(event) {
  event.data.textSource.disabled = false;
  event.data.textSource.select();
  event.data.textSource.setSelectionRange(0, 99999);
  document.execCommand("copy");
  event.data.textSource.disabled = true;

  event.target.classList.replace("btn-default", "btn-success");
}

function loadTemplate(url, cb) {
  $.ajax(url, {
    success: function(data) {
      cb(data);
    }
  });
}

function compileData(config) {
  var compiled = JSON.parse(localStorage.getItem("hotelFormData") || "{}");

  compiled.secret = "■■■■■■■";
  var configKeywords = Object.keys(config.keywords);
  for (var i = 0; i < configKeywords.length; i++) {
    var value = config.keywords[configKeywords[i]];
    if (typeof value === "string") {
      compiled[configKeywords[i]] = value;
    } else {
      compiled[configKeywords[i]] = "■■■■■■■";
    }
  }

  // handle conversion from iso date to local date
  compiled.arrival = dateFormatHelper(compiled.arrival, config.dates.dateFormat);
  compiled.departure = dateFormatHelper(compiled.departure, config.dates.dateFormat);

  compiled.hasSecondPerson =
    compiled.roomsize === "2" || compiled.roomsize === "3";
  compiled.hasThirdPerson = compiled.roomsize === "3";

  compiled.roomtype = config.roomtypes[compiled.roomtype - 1].name;

  return compiled;
}

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

function getText(type) {
  if (type === "loading") {
    if (language === "de-DE") {
      return "Laden...";
    } else {
      return "Loading Secret...";
    }
  }
  if (type === "error") {
    if (language === "de-DE") {
      return "Laden fehlgeschlagen! Bitte lade die Seite neu! (Fehler: ";
    } else {
      return "Loading failed! Please reload the page to try again! (Error: ";
    }
  }
}
