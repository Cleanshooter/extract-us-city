(function ($) {
  /* Page Loader active
  ======================================================== */
  $('#preloader').fadeOut();

  /*
   Sticky Nav
   ========================================================================== */
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > 100) {
      $('.header-top-area').addClass('menu-bg');
    } else {
      $('.header-top-area').removeClass('menu-bg');
    }
  });

  /*
   Back Top Link
   ========================================================================== */
  const offset = 200;
  const duration = 500;
  $(window).scroll(function () {
    if ($(this).scrollTop() > offset) {
      $('.back-to-top').fadeIn(400);
    } else {
      $('.back-to-top').fadeOut(400);
    }
  });

  $('.back-to-top').on('click', (event) => {
    event.preventDefault();
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      600,
    );
    return false;
  });

  /*
   One Page Navigation
   ========================================================================== */

  $(window).on('load', () => {
    $('body').scrollspy({
      target: '.navbar-collapse',
      offset: 195,
    });

    $(window).on('scroll', () => {
      if ($(window).scrollTop() > 100) {
        $('.fixed-top').addClass('menu-bg');
      } else {
        $('.fixed-top').removeClass('menu-bg');
      }
    });
  });

  /* Auto Close Responsive Navbar on Click
  ======================================================== */
  function close_toggle() {
    if ($(window).width() <= 768) {
      $('.navbar-collapse a').on('click', () => {
        $('.navbar-collapse').collapse('hide');
      });
    } else {
      $('.navbar .navbar-inverse a').off('click');
    }
  }
  close_toggle();
  $(window).resize(close_toggle);
}(jQuery));
