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
  $("#showpage a").attr(
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
    if (date.valueOf() <= Date.now()) {
      $(".alert-warning").text("Loading Secret...");
      $.ajax(value.location, {
        success: function(data) {
          config.keywords[key] = data;
          render(config, template);
          $(".alert-warning").remove();
        },
        error: function(xhr, status, error) {
          $(".alert-warning").text(
            "Loading failed! Please reload the page to try again! (Error: " +
              error +
              ")"
          );
        }
      });
    } else {
      var timeString = dateFns.distanceInWordsToNow(date, {
        includeSeconds: true
      });
      document.getElementById("secret-timer").textContent = timeString;
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
