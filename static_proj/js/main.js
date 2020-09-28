$(document).ready((f) => {
  const sort_by = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
        return primer(x[field]);
      }
      : function (x) {
        return x[field];
      };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const configure = (val) => {
    if (val > 0) {
      return "+" + numberWithCommas(val);
    }
    return val;
  };

  function search(nameKey, myArray) {
    if (myArray && typeof myArray == "object") {
      obj = [];
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].Country.toLowerCase().indexOf(nameKey) != -1) {
          obj.push(myArray[i]);
        }
      }
      return obj;
    }
  }

  var typingTimer;
  var sel = $("#corona-data");
  var table = $("table");
  var error = $(".error");
  var s = $("ul.world-data");
  var countries = "Loading...";
  var doneInterval = 2000;
  var searchInput = $("#table-search-form input[type=text]");
  var loading =
    '<div id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>';
  var world_url = "https://api.covid19api.com/world/total";
  var summary_url = "https://api.covid19api.com/summary";
  var searchQuery;

  $('.install-btn').click(function(event) {
    console.log(event, deferredPrompt);
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);

        if (choiceResult.outcome === "dismissed") {
          console.log("User cancelled installation..");
        } else {
          console.log("User added to homescreen");
        }
      })
    }
    deferredPrompt = null;
  })

  searchInput.keyup(function (e) {
    searchQuery = $(this).val().toLowerCase();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(
      showData(search(searchQuery, countries)),
      doneInterval
    );
  });

  searchInput.keydown(function (e) {
    clearTimeout(typingTimer);
  });

  console.log(searchQuery);

  sel.append(countries);
  s.append(loading);
  sel.append(loading);

  const showData = (arr = [], err_msg = null) => {
    console.log("showing data...");
    $("form").prevent;
    sel.empty();
    if (err_msg) {
      table.hide();
      console.log("appending the message..");
      error.append(`<h3>${err_msg}</h3>`);
      return;
    }
    $.each(
      arr,
      (f = (key, value) => {
        if (value.TotalConfirmed > 0) {
          var country = value.Country;
          var totalConfirmed = value.TotalConfirmed;
          var newConfirmed = value.NewConfirmed;
          var totalDeaths = value.TotalDeaths;
          var newDeaths = value.NewDeaths;
          var totalRecovered = value.TotalRecovered;
          var newRecovered = value.NewRecovered;
          var active = numberWithCommas(
            totalConfirmed - totalRecovered - totalDeaths
          );
          newConfirmed = configure(newConfirmed);
          newDeaths = configure(newDeaths);
          newRecovered = configure(newRecovered);
          var cls_new_confirmed =
            newConfirmed != 0 ? " class='color-blue'" : "";
          var cls_new_deaths = newDeaths != 0 ? " class='color-red'" : "";
          var cls_new_recovered =
            newRecovered != 0 ? " class='color-green'" : "";
          is_india = country == "India" ? " class='indian'" : "";

          sel.append(
            "<tr><th " +
            is_india +
            ">" +
            country +
            "</th><td>" +
            numberWithCommas(totalConfirmed) +
            "</td><td>" +
            active +
            "</td><td" +
            cls_new_confirmed +
            ">" +
            newConfirmed +
            "</td><td>" +
            numberWithCommas(totalDeaths) +
            "</td><td" +
            cls_new_deaths +
            ">" +
            newDeaths +
            "</td><td>" +
            numberWithCommas(totalRecovered) +
            "</td><td" +
            cls_new_recovered +
            ">" +
            newRecovered +
            "</td></tr>"
          );
        }
      })
    );
  };

  const showWorldData = function (data) {
    s.empty();
    s.append(
      '<li class="mdl-list__item mdl-list__item--two-line"> \
          <span class="mdl-list__item-primary-content"> \
            <span>TOTAL CONFIRMED CASES</span> \
            <span class="mdl-list__item-sub-title">' +
      numberWithCommas(data.TotalConfirmed) +
      '</span> \
          </span> \
          <span class="mdl-list__item-secondary-content"> \
          </span> \
        </li>' +
      '<li class="mdl-list__item mdl-list__item--two-line"> \
          <span class="mdl-list__item-primary-content"> \
            <span>TOTAL DEATHS</span> \
            <span class="mdl-list__item-sub-title">' +
      numberWithCommas(data.TotalDeaths) +
      '</span> \
          </span> \
          <span class="mdl-list__item-secondary-content"> \
          </span> \
        </li>' +
      '<li class="mdl-list__item mdl-list__item--two-line"> \
          <span class="mdl-list__item-primary-content"> \
            <span>TOTAL RECOVERED</span> \
            <span class="mdl-list__item-sub-title">' +
      numberWithCommas(data.TotalRecovered) +
      '</span> \
          </span> \
          <span class="mdl-list__item-secondary-content"> \
          </span> \
        </li>'
    )
  }

  var worldDataRecieved = false;
  var countryDataRecieved = false;

  fetch(world_url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      worldDataRecieved = true;
      console.log("From web", data)
      showWorldData(data);
    }).catch(f = (err) => {
      console.log("error", err);
    });

  fetch(summary_url)
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then(function (data) {
      countryDataRecieved = true;
      console.log("From web", data)
      if ("Countries" in data) {
        countries = data.Countries;
        countries.sort(sort_by("TotalConfirmed", true, parseInt));
        showData(countries);
      } else {
        console.log("adding error message");
        error.empty();
        showData([], (err_msg = data.Messag));
      }
    }).catch(f = (err) => {
      console.log("error", err);
    });

  if ("caches" in window) {
    caches
      .match(world_url)
      .then(
        (function (res) {
          if (res) {
            return res.json();
          }
        })
      )
      .then(
        (function (data) {
          console.log("From cache", data);
          if (!worldDataRecieved) {
            showWorldData(data);
          }
        })
      ).catch(function (err) {
        console.log(err);
      });

      caches
      .match(summary_url)
      .then(
        (function (res) {
          if (res) {
            return res.json();
          }
        })
      )
      .then(
        (function (data) {
          console.log("From cache", data);
          if (!countryDataRecieved) {
            if ("Countries" in data) {
              countries = data.Countries;
              countries.sort(sort_by("TotalConfirmed", true, parseInt));
              showData(countries);
            } else {
              console.log("adding error message");
              error.empty();
              showData([], (err_msg = data.Message));
            }
          }
        })
      ).catch(function (err) {

      });
  }


});

