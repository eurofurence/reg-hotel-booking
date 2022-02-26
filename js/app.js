var config;

function isMainPage() {
  return $("#mainpage").length > 0;
}

function unhideInfoWell() {
  $("#unhide_with_js").css("visibility", "visible");
  $("#hide_with_js").css("visibility", "hidden");
}

function isFormPage() {
  return $("#formpage").length > 0;
}

function disableClickOnNavbarLinks() {
  $(".nav li.noclick a").click(function() {
    return false;
  });
}

function updatePrices() {
  var roomsize = $("input[name=roomsize]:checked").val();
  var maxType = $("#roomtype_max").val();
  for (var i = 1; i <= maxType; i++) {
    var price = "(" + $("#price" + i + "_" + roomsize).val() + "*)";
    $("#roomtype" + i + "price").text(price);
  }
}

function activateElement(selector, active) {
  if (active) {
    $(selector).addClass("active");
    if ($(selector).hasClass("collapse")) $(selector).collapse("show");
  } else {
    $(selector).removeClass("active");
    if ($(selector).hasClass("collapse")) $(selector).collapse("hide");
  }
}

function changedRoomsize(value) {
  activateElement(
    "#ef-firstpersongroup",
    value === "1" || value === "2" || value === "3"
  );
  activateElement("#ef-secondpersongroup", value === "2" || value === "3");
  activateElement("#ef-thirdpersongroup", value === "3");
  $("input.secondperson").prop("disabled", value === "1");
  $("input.thirdperson").prop("disabled", value === "1" || value === "2");
  updatePrices();
}

function switchActiveOnRoomsize() {
  $("input[type=radio][name=roomsize]").change(function() {
    changedRoomsize(this.value);
  });
}

function setInitialRoomsize() {
  var initialSize = $("#size_initial").val();
  if (initialSize === "3") {
    $("#size_triple").prop("checked", true);
  } else if (initialSize === "2") {
    $("#size_double").prop("checked", true);
  } else {
    $("#size_single").prop("checked", true);
  }
  changedRoomsize(initialSize);
}

function changedRoomtype(value) {
  var maxType = $("#roomtype_max").val();
  for (var i = 1; i <= maxType; i++) {
    activateElement("#roomtype" + i + "button", i == value);
  }
}

function switchActiveOnRoomtype() {
  $("input[type=radio][name=roomtype]").change(function() {
    changedRoomtype(this.value);
  });
}

function setInitialRoomtype() {
  var initialType = $("#roomtype_initial").val();
  $("#roomtype" + initialType).prop("checked", true);
  changedRoomtype(initialType);
}

function initializeDatepicker(dates) {
  var datepickerLanguage = $("#languagecode").attr("class");
  if (datepickerLanguage === "en") {
    datepickerLanguage = "en-GB";
  }
  var dateFormat = dates.dateFormat;
  var arrivalElem = $("#arrival");
  var departureElem = $("#departure");

  if (!arrivalElem.val()) {
    arrivalElem.val(dates.arrival.default);
  }
  if (!departureElem.val()) {
    departureElem.val(dates.departure.default);
  }

  arrivalElem.datepicker({
    language: datepickerLanguage,
    format: dateFormat,
    startDate: dates.arrival.earliest,
    endDate: dates.arrival.latest
  });
  departureElem.datepicker({
    language: datepickerLanguage,
    format: dateFormat,
    startDate: dates.departure.earliest,
    endDate: dates.departure.latest
  });
}

// convert a locale formatted date to an ISO date
function dateConv(str) {
  if (!config) return;
  var format = config.dates.dateFormat;
  var res = str;
  if (format === "mm/dd/yyyy") {
    res = res.replace(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/, "$3-$1-$2");
  } else if (format === "dd.mm.yyyy") {
    res = res.replace(/([0-9]{2})\.([0-9]{2})\.([0-9]{4})/, "$3-$2-$1");
  } else {
    alert("unsupported date format: " + format);
    return "";
  }
  if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(res)) {
    return "";
  }
  return res;
}

// convert an iso date to a locale formatted date
function dateFormatHelper(str, format) {
  var res = str;
  if (format === "mm/dd/yyyy") {
    res = res.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/, "$2/$3/$1");
  } else if (format === "dd.mm.yyyy") {
    res = res.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/, "$3.$2.$1");
  } else {
    alert("unsupported date format: " + format);
    return "";
  }
  return res;
}

function dateFormat(str) {
  if (!config) return;
  var format = config.dates.dateFormat;
  return dateFormatHelper(str, format);
}

function fieldErrorMarker(surroundingSpanId, isOk) {
  if (isOk) {
    $(surroundingSpanId).removeClass("has-error");
  } else {
    $(surroundingSpanId).addClass("has-error");
  }
}

function areDatesOk() {
  if (!config) {
    return false;
  }
  var arrival_ok = true;
  var departure_ok = true;

  var arrival = dateConv($("#arrival").val());
  var arr_start = dateConv(config.dates.arrival.earliest);
  var arr_end = dateConv(config.dates.arrival.latest);
  if (arrival === "" || arr_start === "" || arr_end === "") {
    arrival_ok = false;
  }
  var departure = dateConv($("#departure").val());
  var dep_start = dateConv(config.dates.departure.earliest);
  var dep_end = dateConv(config.dates.departure.latest);
  if (departure === "" || dep_start === "" || dep_end === "") {
    departure_ok = false;
  }
  if (!(arrival < departure)) {
    arrival_ok = false;
    departure_ok = false;
  }
  if (arrival < arr_start || arr_end < arrival) {
    arrival_ok = false;
  }
  if (departure < dep_start || dep_end < departure) {
    departure_ok = false;
  }
  fieldErrorMarker("#arrival_error", arrival_ok);
  fieldErrorMarker("#departure_error", departure_ok);
  return arrival_ok && departure_ok;
}

function isDisclaimerAccepted() {
  var disclaimer_ok = $("input[type=checkbox][name=understood]:checked").length;
  fieldErrorMarker("#understood_error", disclaimer_ok);
  return disclaimer_ok;
}

function getCommentLength() {
  var value = $("#comments").val();
  value = "" + value;
  return value.length;
}

function getCommentLimit() {
  return 2000;
}

function isCommentNotTooLong() {
  var comments_ok = getCommentLength() <= getCommentLimit();
  fieldErrorMarker("#comments_error", comments_ok);
  return comments_ok;
}

function canSubmit() {
  var datesOk = areDatesOk();
  var disclaimerOk = isDisclaimerAccepted();
  var commentsOk = isCommentNotTooLong();
  var requiredFieldsOk = areRequiredFieldsOk();
  return datesOk && disclaimerOk && commentsOk && requiredFieldsOk;
}

function areRequiredFieldsOk() {
  return !document.querySelector("input:invalid");
}

function storeFormValues() {
  var elements = document.getElementById("form").elements;
  var data = {};
  for (var i = 0; i < elements.length; i++) {
    data[elements[i].id] = elements[i].value;
  }
  // make this work on IE and other browsers at the same time
  // data.roomsize = elements.roomsize.value;
  // data.roomtype = elements.roomtype.value;
  var roomsizeRadios = document.getElementsByName('roomsize');
  for (i = 0; i < roomsizeRadios.length; i++) {
    if (roomsizeRadios[i].checked) {
      data['roomsize'] = roomsizeRadios[i].value;
    }
  }
  var roomtypeRadios = document.getElementsByName('roomtype');
  for (i = 0; i < roomtypeRadios.length; i++) {
    if (roomtypeRadios[i].checked) {
      data['roomtype'] = roomtypeRadios[i].value;
      break;
    }
  }

  // deal with potential date format change due to language switch by storing iso dates
  data.arrival = dateConv(elements.arrival.value);
  data.departure = dateConv(elements.departure.value);

  // do not store the popup message text, or else it will have the wrong language after language switch
  data.cannot_submit = undefined;

  localStorage.setItem("hotelFormData2022", JSON.stringify(data));

  potentialChangeInSubmitState();
}

function restoreFormValues() {
  var values = JSON.parse(window.localStorage.getItem("hotelFormData2022") || "{}");

  if (typeof values['roomsize'] === "undefined") {
    values['roomsize'] = "2";
  }

  if (typeof values['roomtype'] === "undefined") {
    values['roomtype'] = "1";
  }

  var elements = document.getElementById("form").elements;
  for (var i = 0; i < elements.length; i++) {
    if (typeof values[elements[i].id] !== "undefined") {
      elements[i].value = values[elements[i].id];
    }
  }
  // make this work on IE and other browsers at the same time
  // elements.roomsize.value = values.roomsize;
  // elements.roomtype.value = values.roomtype;
  var roomsizeRadios = document.getElementsByName('roomsize');
  for (i = 0; i < roomsizeRadios.length; i++) {
    if (values['roomsize'] === roomsizeRadios[i].value) {
      roomsizeRadios[i].checked = true;
    }
  }
  var roomtypeRadios = document.getElementsByName('roomtype');
  for (i = 0; i < roomtypeRadios.length - 1; i++) {
    if (values['roomtype'] === roomtypeRadios[i].value) {
      roomtypeRadios[i].checked = true;
    }
  }

  // deal with potential date format change due to language switch
  if (values.arrival && values.departure) {
    elements.arrival.value = dateFormat(values.arrival);
    elements.departure.value = dateFormat(values.departure);
  }

  changedRoomsize(values.roomsize);
  changedRoomtype(values.roomtype);
}

function setupFormValueStoring() {
  $("#form").on("input", storeFormValues);
  $("#arrival").change(storeFormValues);
  $("#departure").change(storeFormValues);
  $("input[name=roomsize]").change(storeFormValues);
  $("input[name=roomtype]").change(storeFormValues);
  $("#automated_test_config").change(storeFormValues);
}

function preventSubmitUntilConfirmed() {
  $("#form").submit(function(e) {
    if (!canSubmit()) {
      var message = $("#cannot_submit").val();
      if (message) alert(message);
    } else {
      location.href = "reservation-show.html";
    }
    return false;
  });
}

function potentialChangeInSubmitState() {
  var submitbutton = $("#submitbutton");
  if (canSubmit()) {
    submitbutton.removeClass("btn-default");
    submitbutton.addClass("btn-primary");
    submitbutton.addClass("active");
  } else {
    submitbutton.removeClass("active");
    submitbutton.removeClass("btn-primary");
    submitbutton.addClass("btn-default");
  }
}

function switchSubmitOnConfirm() {
  $("input[type=checkbox][name=understood]").change(function() {
    potentialChangeInSubmitState();
  });
}

function switchSubmitOnChangedDates() {
  $("#arrival").change(function() {
    potentialChangeInSubmitState();
  });
  $("#departure").change(function() {
    potentialChangeInSubmitState();
  });
}

function switchSubmitOnCommentChange() {
  var commentField = $("#comments");
  commentField.keyup(function() {
    potentialChangeInSubmitState();
  });
  commentField.change(function() {
    potentialChangeInSubmitState();
  });
}

function setupRoomTypes(roomTypes) {
  $("#roomtype_max").val(roomTypes.length);

  roomTypes.forEach(function(roomType, idx) {
    var i = idx + 1;
    var roomTypeTemplateElem = $("#roomtype_template");
    var element = roomTypeTemplateElem.clone();
    element.attr("id", null);
    element.removeClass("template");

    element.find("label.btn").attr("id", "roomtype" + i + "button");
    element.find("label.btn input").attr("id", "roomtype" + i);
    element.find("label.btn input").val(i);
    element.find("label.btn > span:first-of-type").text(roomType.name);
    element.find("a").attr("href", roomType.infolink);
    element.find("#roomtypeprice").attr("id", "roomtype" + i + "price");

    for (var j = 1; j <= 3; j++) {
      element.find("#price_" + j).val(roomType["price" + j] + ",00 €");
      element.find("#price_" + j).attr("name", "price" + i + "_" + j);
      element.find("#price_" + j).attr("id", "price" + i + "_" + j);
    }

    roomTypeTemplateElem.before(element);
  });
}

function loadConfig(cb) {
  $.ajax("config.json", {
    success: cb
  });
}

$(document).ready(function() {
  disableClickOnNavbarLinks();

  if (isMainPage()) {
    unhideInfoWell();
  }
  if (isFormPage()) {
    loadConfig(function(data) {
      config = data;
      setupRoomTypes(data.roomtypes);

      preventSubmitUntilConfirmed();

      switchActiveOnRoomsize();
      setInitialRoomsize();

      switchActiveOnRoomtype();
      setInitialRoomtype();

      updatePrices();

      switchSubmitOnConfirm();
      switchSubmitOnChangedDates();
      switchSubmitOnCommentChange();

      restoreFormValues();

      setupFormValueStoring();

      initializeDatepicker(data.dates);

      potentialChangeInSubmitState();
    });
  }
});
