$(document).ready(function() {
  loadConfig(function(config) {
    loadTemplate(config.mail.template, function(template) {
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
    });
  });
});

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
