var language = $("html").attr("lang");

$(document).ready(function() {
  loadConfig(function(config) {
    loadTemplate(config.mail.template, function(template) {
      render(config, template);
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
  $("#ready-text a").attr(
    "href",
    "mailto:" +
      config.mail.recipient +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
  );

  var keywords = config.keywords;
  var configKeywords = Object.keys(keywords);
  for (var i = 0; i < configKeywords.length; i++) {
    var value = keywords[configKeywords[i]];
    if (typeof value === "object") {
      setupSecretLoader(config, template, configKeywords[i]);
    }
  }
}

function setupSecretLoader(config, template, key) {
  var value = config.keywords[key];
  var date = new Date(value.time);
  function secretLoader() {
    var now = Date.now();
    if (date.valueOf() <= now) {
      $("#secret-timer").text(getText("loading"));
      $.ajax(value.location, {
        success: function(data) {
          config.keywords[key] = data;
          render(config, template);
          $("#countdown-text").remove();
          $("#ready-text").css("display", "block");
        },
        error: function(xhr, status, error) {
          $("#secret-timer").css("color", "red");
          $("#secret-timer").text(getText("error") + error + ")");
        }
      });
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
}

function loadTemplate(url, cb) {
  $.ajax(url, {
    success: function(data) {
      cb(data);
    }
  });
}

function compileData(data) {
  var compiled = JSON.parse(localStorage.getItem("hotelFormData") || "{}");

  var configKeywords = Object.keys(data.keywords);
  for (var i = 0; i < configKeywords.length; i++) {
    var value = data.keywords[configKeywords[i]];
    if (typeof value === "string") {
      compiled[configKeywords[i]] = value;
    } else {
      compiled[configKeywords[i]] = "■■■■■■■";
    }
  }

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
