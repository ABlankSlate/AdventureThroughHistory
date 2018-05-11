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

const path = window.location.pathname.split('/');
var page = path[path.length-1].split('.')[0];
if(page == '') page = 'index';

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
          window.location.href = './' + $('[data-time-selection]').html() + '.html';
        }, 1500);
      }, 500);
    });
    animateHourglass('[data-hourglass]', 0);
    break;
  case '50s':
    ml1();
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

function ml6() {
  $('.ml6 .letters').each(function(){
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
  $('.ml1 .letters').each(function(){
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