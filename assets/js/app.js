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