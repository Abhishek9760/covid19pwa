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

  const configure = (val) => {
    if (val > 0) {
      return "+"+String(val);
    }
    return val
  }

  function search(nameKey, myArray){
    obj = [];
    for (var i=0; i < myArray.length; i++) {
        if(myArray[i].Country.toLocaleLowerCase().indexOf(nameKey) != -1){
          obj.push(myArray[i])
        }
    }
    return obj;
  }

    var typingTimer;
    var doneInterval = 2000;
    var searchInput = $("#table-search-form input[type=text]");
    var searchQuery;
    searchInput.keyup(function(e) {
      searchQuery = $(this).val();
      clearTimeout(typingTimer)
      typingTimer = setTimeout(fetchData(searchQuery), doneInterval)
    });

    searchInput.keydown(function(e) {
      clearTimeout(typingTimer);
    });


  const showData = (arr) => {
    var sel = $("#corona-data")
    sel.empty()
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
           totalConfirmed +"</td><td>"+ active +"</td><td"+ cls_new_confirmed +">"+
            newConfirmed +"</td><td>"+ totalDeaths +"</td><td"+ cls_new_deaths +">"+
             newDeaths +"</td><td>"+ totalRecovered +"</td><td"+ cls_new_recovered +">"+
              newRecovered +"</td><td><small>"+ moment.utc(date).format("LT") +"</small></td></tr>"
        )

      }
    })
  }

  const fetchData = (q=null) => {
    $.ajax({
    url: "https://api.covid19api.com/summary",
    method: "GET",
    success: f = (data) => {
      countries = data.Countries;
      countries.sort(sort_by("TotalConfirmed", true, parseInt));
      if (q) {
        countries = search(q, countries);
      }
      showData(countries);
    },
    error: f = (error) => {
      console.log(error)
    }
  })
  }

    fetchData()
})