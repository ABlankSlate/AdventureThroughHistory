document.addEventListener('DOMContentLoaded', function() {
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener('click', function() {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

var fixedNav = false;
var scrollListenerElements = [];
var scrollListenerEvents = [];

function addScrollListener(elem, callback) {
  scrollListenerElements.push(elem);
  scrollListenerEvents.push(callback);
}

$(window).on('scroll', function() {
  if(!isScrolledIntoView('.hero-foot')) {
    if(!fixedNav) {
      fixedNav = true;
      $('[nav-tabs]').addClass('is-fixed-top');
    }
  } else {
    if(fixedNav) {
      fixedNav = false;
      $('[nav-tabs]').removeClass('is-fixed-top');
    }
  }
  for(var i=0; i<scrollListenerElements.length; i++) {
    var elem = scrollListenerElements[i];
    var keepEvent = false;
    if(elem.indexOf('^') == 0) {
      keepEvent = true;
      elem = elem.substring(1, elem.length);
    }
    if(isScrolledIntoView($(elem)) 
        && scrollListenerEvents[i] != undefined) {
      scrollListenerEvents[i]();
      if(!keepEvent) 
        scrollListenerEvents[i] = undefined;
    }
  }
});

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function setActiveTab(tabRoot, active) {
  var tabContainer = $(tabRoot + ' .container ul');
  var activeTab = tabContainer.find('.is-active');
  
  activeTab.removeClass('is-active');
  $(tabContainer).find('li:nth-child(' + active + ')').addClass('is-active');
}

function scrollToElem(elem) {
  $('html, body').animate({
    scrollTop: $(elem).offset().top
  }, 500);
}

const path = window.location.href.split('/');
const lastPath = path[path.length-1];
var page = lastPath.split('.')[0];
var hash = '';
if(page == '') page = 'index';
if(lastPath.indexOf('#') > -1) {
  var arr = lastPath.split('#');
  page = arr[0];
  hash = arr[1];
}

switch(page) {
  case 'index':
    $('[time-capsule-select] select').on('change', function() {
      $('[time-capsule-button]').removeAttr('disabled');
      $('[data-time-selection]').html($(this).val());
    });
    $('[time-capsule-button]').on('click', function() {
      if($(this).attr('disabled')) return;
      $('[time-capsule-select] select').attr('disabled', '');
      $('[time-capsule-button]').addClass('is-loading');
      $('[time-loader-1]').addClass('animated lightSpeedOut');
      setTimeout(function() {
        $('[time-loader-1]').hide();
        $('[time-loader-2]').show();
        $('[time-loader-2]').addClass('animated lightSpeedIn');
        setTimeout(function() {
          window.location.href = './capsule#' + $('[data-time-selection]').html();
        }, 1000);
      }, 500);
    });
    animateHourglass('[data-hourglass]', 0);
    $('.hero-body').attr('style', '');
    anime.timeline({loop: false})
      .add({
        targets: '.hero-body',
        scale: [14,1],
        opacity: [0,1],
        easing: "easeOutCirc",
        duration: 800,
        delay: function(el, i) {
          return 800 * i;
        }
    });
    break;
  case 'capsule':
    if(hash == '') {
      window.location.href = '/';
    } else {
      fetch('/assets/content.json').then(function(response) {
        return response.json();
      }).then(function(content) {
        if(content[hash] != undefined) {
          const history = content[hash];

          // Placeholder variables in HTML
          $('[filler-timeframe]').html(hash);
          $('[filler-one-big-idea]').html(history['one_big_idea']);

          // LR Content
          var left = true;
          var current = 0;
          history['influential_people'].forEach(person => {
            var element = buildLRContent(person['name'], person['photo'], person['personal_account'], left);
            $('[filler-influential-people]').append(element);
            left = !left;
            current++;
            if(current < history['influential_people'].length) 
              $('[filler-influential-people]').append('<br><br>');
          });
          left = true;
          current = 0;
          history['global_hotspots'].forEach(hotspot => {
            var element = buildLRContent(hotspot['region'], hotspot['photo'], hotspot['description'], left);
            $('[filler-global-hotspots]').append(element);
            left = !left;
            current++;
            if(current < history['global_hotspots'].length) 
              $('[filler-influential-people]').append('<br><br>');
          });
          left = true;
          current = 0;
          history['technological_advances'].forEach(hotspot => {
            var element = buildLRContent(hotspot['name'], hotspot['photo'], hotspot['description'], left);
            $('[filler-technological-advances]').append(element);
            left = !left;
            current++;
            if(current < history['technological_advances'].length) 
              $('[filler-influential-people]').append('<br><br>');
          });

          // Timeline Content
          $('[filler-important-events]').append('<header class="timeline-header"> <span class="tag is-medium is-primary">' + history['important_events']['start_year'] + '</span> </header>');
          history['important_events']['events'].forEach(event => {
            if(event['item_type'] == 'event') {
              $('[filler-important-events]').append(buildTimelineEvent(event['title'], event['photo'], event['description']));
            } else {
              $('[filler-important-events]').append('<header class="timeline-header"> <span class="tag is-primary">' + event['title'] + '</span> </header>');
            }
          });
          $('[filler-important-events]').append('<header class="timeline-header"> <span class="tag is-medium is-primary">' + history['important_events']['end_year'] + '</span> </header>');

          // Nav Tab Smooth Scroll
          $('[nav-tabs] li a').on('click', function(e) {
            e.preventDefault();
            scrollToElem($(this).attr('href'));
          });

          // Nav Tab Active Listeners
          addScrollListener('^section:eq(0)', function() {setActiveTab('[nav-tabs]', 1)});
          addScrollListener('^section:eq(2)', function() {setActiveTab('[nav-tabs]', 2)});
          addScrollListener('^section:eq(4)', function() {setActiveTab('[nav-tabs]', 3)});
          addScrollListener('^section:eq(6)', function() {setActiveTab('[nav-tabs]', 4)});
          addScrollListener('^section:eq(8)', function() {setActiveTab('[nav-tabs]', 5)});
          addScrollListener('^section:eq(10)', function() {setActiveTab('[nav-tabs]', 6)});

          // Highlight Effect Listeners
          var hlElements = document.querySelectorAll('[hl]');
          hlElements.forEach(element => {
            var attr = element.getAttribute('hl');
            addScrollListener('[hl="' + attr + '"]', function() {ml14('[hl="' + attr + '"]')});
          });

          // Bouncy Image Effect Listeners
          var biElements = document.querySelectorAll('[bouncy-img]');
          biElements.forEach(element => {
            var attr = element.getAttribute('bouncy-img');
            addScrollListener('[bouncy-img="' + attr + '"]', function() {$('[bouncy-img="' + attr + '"]').addClass('animated bounce')});
          });

          // Pulse Image Effect Listeners
          var puElements = document.querySelectorAll('[pulse-img]');
          puElements.forEach(element => {
            var attr = element.getAttribute('pulse-img');
            addScrollListener('[pulse-img="' + attr + '"]', function() {$('[pulse-img="' + attr + '"]').addClass('animated pulse')});
          });
          
          setTimeout(function() {
            $('.pageloader').removeClass('is-active');
            $('html').attr('style', '');
            ml1();
          }, 500);
        } else {
          window.location.href = '/';
        }
      });
    }
    break;
  default:
    console.log('No data for this page.');
    break;
}

function animateHourglass(element, frame) {
  frame++;
  if(frame > 3) frame = 0;
  switch(frame) {
    case 0:
      $(element).attr('data-prefix', 'far');
      $(element).attr('data-icon', 'hourglass');
      break;
    case 1:
      $(element).attr('data-prefix', 'fas');
      $(element).attr('data-icon', 'hourglass-start');
      break;
    case 2:
      $(element).attr('data-icon', 'hourglass-half');
      break;
    case 3:
      $(element).attr('data-icon', 'hourglass-end');
      break;
  }
  setTimeout(function() {
    animateHourglass(element, frame);
  }, 300);
}

function ml14(rootElem) {
  $(rootElem + ' .letters').each(function() {
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });

  setTimeout(function() {
    $(rootElem).attr('style', '');
  }, 50);
  
  anime.timeline({loop: false})
  .add({
    targets: rootElem + ' .letter',
    opacity: [0,1],
    translateX: [40,0],
    translateZ: 0,
    scaleX: [0.3, 1],
    easing: "easeOutExpo",
    duration: 800,
    delay: function(el, i) {
      return 150 + 25 * i;
    }
  });
}

function ml1() {
  $('.ml1 .letters').each(function() {
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });

  setTimeout(function() {
    $('.ml1').attr('style', '');
  }, 50);
  
  anime.timeline({loop: false})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: function(el, i) {
      return 70 * (i+1)
    }
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: function(el, i, l) {
      return 80 * (l - i);
    }
  });
}

// Code Templates

function buildLRContent(title, photo, content, is_left) {
  content = buildHighlightContent(content);
  if(is_left) {
    return '<div class="columns"> <div class="column is-one-quarter"> <div class="box" bouncy-img="' + generateHash() + '"> <figure class="image is-square"> <img src="' + photo + '"> </figure> </div> </div> <div class="column is-half ml-sect"> <br> <h3 class="title is-3">' + title + '</h3> <p class="subtitle is-5"> ' + content + ' </p> </div> </div>';
  } else {
    return '<div class="columns"> <div class="column is-quarter"></div> <div class="column is-quarter mr-sect"> <h3 class="title is-3">' + title + '</h3> <p class="subtitle is-5"> ' + content + ' </p> </div> <div class="column is-one-quarter"> <div class="box" bouncy-img="' + generateHash() + '"> <figure class="image is-square"> <img src="' + photo + '"> </figure> </div> </div> </div>';
  }
}

function buildHighlightContent(content) {
  var tagStart = content.search('<highlight>');
  var tagEnd = content.search('</highlight>');
  if(tagStart > -1 && tagEnd > -1) {
    var original = content.substring((tagStart+11), tagEnd);
    var hlHash = generateHash();
    var change = '<span class="ml14 subtitle is-5" hl=' + hlHash + '> <span class="text-wrapper"> <span class="letters">' + original + '</span> </span> </span>';
    content = content.replace('<highlight>' + original + '</highlight>', change);
    return buildHighlightContent(content);
  } else {
    return content;
  }
}

function buildTimelineEvent(title, photo, content) {
  return '<div class="timeline-item"> <div class="timeline-marker"></div> <div class="timeline-content"> <p class="heading">' + title + '</p> <div class="column is-one-quarter"> <div class="box" pulse-img="' + generateHash() + '"> <figure class="image is-square"> <img src="' + photo + '"> </figure> </div> </div> <p>' + content + '</p> </div> </div>';
}

function generateHash() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i<5; i++)
    text+=possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}