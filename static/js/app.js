function get_counter() {
  $.ajax({
    url: 'https://www.hackerspace.gr/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Network/Leases',
    dataType: 'jsonp',
    crossDomain: true,
    cache: false
  }).done(function(json) {
    var count = json.query.pages[168].revisions[0]["*"];
    var splitted = count.split(" ");
    var random_no = Math.floor((Math.random()*10)+2);
    var skadalia = [
      'thieves',
      'ghosts',
      'rats',
      'mosquitos',
      'resistors',
      'capacitors',
      'supermodels',
      'astronauts',
      'aliens',
      'M$ users',
      'books',
      'unicorns',
      'nyan cats',
      'ground stations'
    ];
    var random_text = Math.floor(Math.random()*skadalia.length);
    if ( isNaN(splitted[0]) ) {
      $("#openornot").html('0 hackers and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now closed!');
    } else if (splitted[0] == "0") {
      $('#counter').html(splitted[0]);
      $('#openornot').html('hackers and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now closed!');
    } else if (splitted[0] == "-1") {
      $('#counter').html("");
      $('#openornot').html('Cannot determine if the space is open or closed. Please check again later.');
    } else {
      $('#counter').html(splitted[0]);
      $("#counter").css("font-weight", "bold");
      $('#openornot').html('<b>hackers</b> and ' + random_no + ' ' + skadalia[random_text] + ' in space, means that space is now <b>open</b>!');
    }
  });
};

// Display All future events in ical file as list.
function displayEvents(events, events_current, limit) {
  // Foreach event
  for ( var i=0; i<Math.min(limit, events.length); i++) {
    // Create a list item
    var li = document.createElement('li');
    var eventid = "#EventModal-c" + i;
    var eventdesc = "#EventDescription-c" + i;
    var eventtitle = "#EventLabel-c" + i;
    var eventdate = "#EventDate-c" + i;
    var eventedit = "#EventEdit-c" + i;
    li.setAttribute('class', 'event');
    // Add details from cal file.
    li.innerHTML = '<span class="fa fa-calendar"></span> <a data-toggle="modal" data-target="'+eventid+'" href="#">' +
    events[i].SUMMARY + '</a><br>&nbsp;&nbsp;&nbsp;&nbsp;' + events[i].day + ', ' + events[i].start_day + '.' +
    events[i].start_month + ' ' + events[i].start_time + '';
    // Add list item to list.
    document.getElementById('calendar').appendChild(li);
    $(eventdesc).html(events[i].DESCRIPTION);
    $(eventtitle).html(events[i].SUMMARY);
    $(eventdate).html(events[i].day + ', ' + events[i].start_day + '.' + events[i].start_month + ' ' + events[i].start_time);
    $(eventedit).attr("href", events[i].URL);
  }
  for ( var j=0; j<Math.min(limit,events.length); j++) {
    // Create a list item
    var li = document.createElement('li');
    li.setAttribute('class', 'event');
    // Add details from cal file.
    li.innerHTML = '<span class="fa fa-calendar"></span> <a target="_blank" href="'+ events_current[j].URL + '">' +
    events_current[j].SUMMARY + '</a><br>&nbsp;&nbsp;&nbsp;&nbsp;' + events_current[j].day + ', ' + events_current[j].start_day + '/' +
    events_current[j].start_month + ' ' +events_current[j].start_time + ' - ' + events_current[j].end_time + '';
    document.getElementById('calendar_current').appendChild(li);
  }
}

// get upcoming events
var a, b;
function get_events() {
  var ical_url = 'https://www.hackerspace.gr/wiki/Special:Ask/-5B-5BCategory:Events-7C-7CMeetings-5D-5D/-3FTitle%3Dsummary/-3FStart-20date%3Dstart/-3FEnd-20date%3Dend/-3FLocation%3Dlocation/-3Ftagline%3Ddescription/format%3D-20icalendar/limit%3D-2050/sort%3D-20Start-20date/order%3Ddesc/searchlabel%3D-20iCal/title%3D-20hsgr/offset%3D0';
  new ical_parser(ical_url, function(cal) {
    a = cal.getFutureEvents();
    b = cal.getCurrentEvents();
    displayEvents(a,b,6);
  });
}

function get_news() {
  $("#news").FeedEk({
    FeedUrl : "https://www.hackerspace.gr/wiki/index.php?title=News&action=feed&feed=rss",
    MaxCount : 5,
    ShowDesc : false,
    ShowPubDate: false
  });
};


function get_photos() {
  var flickr_mashup = $('#flickr-mashup');
  var hashtag = flickr_mashup.data('hashtag');
  flickr_mashup.flickrfeed('', flickr_mashup.data('hashtag').substr(1), {
    limit: 12,
    title: false,
    date: false,
    header: false,
    randomize: true
  }).bind('loaded', function() {
    // Check if images exist
    if ($('.flickrRow').length !== 0) {
      flickr_mashup.slideDown();
    }
  });
}


$(document).ready(function() {
  if(window.location.hash) {
      var hash = window.location.hash;
      $(hash).modal('show');
  }
  get_counter();
  get_events();
  get_news();
  get_photos();

  L.mapbox.accessToken = 'pk.eyJ1IjoiY29temVyYWRkIiwiYSI6ImxjQjFHNFUifQ.ohrYy34a8ZIZejrPSMWIww';
  var map = L.mapbox.map('map', 'comzeradd.jimaooe5',{
      zoomControl: false
  }).setView([38.01697, 23.73140], 15);


  var refreshId = setInterval(function() {
    get_counter();
  }, 100000);
});
