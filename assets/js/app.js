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
        }, 1500);
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
          $('[filler-timeframe]').html(hash);
          $('.pageloader').removeClass('is-active');
          ml1();
        } else {
          window.location.href = '/';
        }
      });
    }
    break;
  case '50s':
    ml1();

    // Nav Tab Smooth Scroll
    $('[nav-tabs] li a').on('click', function(e) {
      e.preventDefault();
      scrollToElem($(this).attr('href'));
    });

    // Nav Tab Active Listener
    addScrollListener('^section:eq(0)', function() {setActiveTab('[nav-tabs]', 1)});
    addScrollListener('^section:eq(2)', function() {setActiveTab('[nav-tabs]', 2)});
    addScrollListener('^section:eq(4)', function() {setActiveTab('[nav-tabs]', 3)});
    addScrollListener('^section:eq(6)', function() {setActiveTab('[nav-tabs]', 4)});
    addScrollListener('^section:eq(8)', function() {setActiveTab('[nav-tabs]', 5)});
    addScrollListener('^section:eq(10)', function() {setActiveTab('[nav-tabs]', 6)});

    // Fidel Castro Effects
    addScrollListener('[castro-img]', function() {$('[castro-img]').addClass('animated bounce')});
    addScrollListener('[ml-castro-1]', function() {ml14('[ml-castro-1]')});
    addScrollListener('[ml-castro-2]', function() {ml14('[ml-castro-2]')});

    // Queen Elizabeth Effects
    addScrollListener('[elizabeth-img]', function() {$('[elizabeth-img]').addClass('animated bounce')});
    addScrollListener('[ml-elizabeth-1]', function() {ml14('[ml-elizabeth-1]')});
    addScrollListener('[ml-elizabeth-1]', function() {ml14('[ml-elizabeth-2]')});
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

function ml6() {
  $('.ml6 .letters').each(function() {
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });

  setTimeout(function() {
    $('.ml6').attr('style', '');
  }, 50);
  
  anime.timeline({loop: false})
    .add({
      targets: '.ml6 .letter',
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: function(el, i) {
        return 50 * i;
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