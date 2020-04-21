$(document).ready(f => {

  const sort_by = (field, reverse, primer) => {
    const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

    reverse = !reverse ? 1 : -1;

    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  const configure = (val) => {
    if (val > 0) {
      return "+"+numberWithCommas(val);
    }
    return val
  }

  function search(nameKey, myArray){
    obj = [];
    for (var i=0; i < myArray.length; i++) {
        if(myArray[i].Country.toLowerCase().indexOf(nameKey) != -1){
          obj.push(myArray[i])
        }
    }
    return obj;
  }

    var typingTimer;
    var sel = $("#corona-data");
    var s = $("div.world-data");
    var countries = 'Loading...';
    var doneInterval = 2000;
    var searchInput = $("#table-search-form input[type=text]");
    var searchQuery;
    searchInput.keyup(function(e) {
      searchQuery = $(this).val().toLowerCase();
      clearTimeout(typingTimer)
      typingTimer = setTimeout(showData(search(searchQuery, countries)), doneInterval)
    });

    searchInput.keydown(function(e) {
      clearTimeout(typingTimer);
    });

    sel.append(countries)
    s.append('Loading...<i class="fa fa-spinner fa-spin"></i>')

  const showData = (arr) => {
    sel.empty();
    $.each(arr, f = (key, value) => {
      if(value.TotalConfirmed > 0) {
        var country = value.Country
        var totalConfirmed = value.TotalConfirmed;
        var newConfirmed = value.NewConfirmed
        var totalDeaths = value.TotalDeaths
        var newDeaths = value.NewDeaths
        var totalRecovered = value.TotalRecovered
        var newRecovered = value.NewRecovered
        var date = value.Date
        var active = totalConfirmed - totalRecovered - totalDeaths
        newConfirmed = configure(newConfirmed)
        newDeaths = configure(newDeaths)
        newRecovered = configure(newRecovered)
        var cls_new_confirmed = newConfirmed!=0 ? " class='color-blue'" : ""
        var cls_new_deaths = newDeaths!=0 ? " class='color-red'" : ""
        var cls_new_recovered = newRecovered!=0 ? " class='color-green'" : ""
        is_india = country=="India" ? " class='indian'" : ""
        
        
        sel.append(
          "<tr><th scope='row'"+ is_india +">"+ country +"</th><td>"+
           numberWithCommas(totalConfirmed) +"</td><td>"+ active +"</td><td"+ cls_new_confirmed +">"+
            newConfirmed +"</td><td>"+ numberWithCommas(totalDeaths) +"</td><td"+ cls_new_deaths +">"+
             newDeaths +"</td><td>"+ numberWithCommas(totalRecovered) +"</td><td"+ cls_new_recovered +">"+
              newRecovered +"</td><td><small>"+ moment.utc(date).format("LT") +"</small></td></tr>"
        )

      }
    });
  }

  function getWorldData() {
    $.ajax({
      url: "https://api.covid19api.com/world/total",
      method: "GET",
      success: f = (data) => {
        s.empty();
        s.append(
          '<ul class="list-group list-group-flush my-4">'+
          "<li class='list-group-item center list-group-item-info lead'>TOTAL CONFIRMED CASES</li>"+
          "<li class='list-group-item center list-group-item-info lead'>"+ numberWithCommas(data.TotalConfirmed) +"</li>"+
          "<li class='list-group-item center list-group-item-danger lead'>TOTAL DEATHS</li>"+
          "<li class='list-group-item center list-group-item-danger lead'>"+ numberWithCommas(data.TotalDeaths) +"</li>"+
          "<li class='list-group-item center list-group-item-success lead'>TOTAL RECOVERED CASES</li>"+
          "<li class='list-group-item center list-group-item-success lead'>"+ numberWithCommas(data.TotalRecovered) +"</li></ul>"
        );
      },
      error: f = (error) => {
        console.log(error)
      }
    })
  }

  getWorldData()

  function fetchData () {
    $.ajax({
    url: "https://api.covid19api.com/summary",
    method: "GET",
    success: f = (data) => {
      countries = data.Countries;
      countries.sort(sort_by("TotalConfirmed", true, parseInt));
      showData(countries);
    },
    error: f = (error) => {
      console.log(error);
    }
  });
  }

  fetchData();
})