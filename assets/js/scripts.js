(function ($) {
  "use strict";

  $(document).ready(function () {
    /*START PRELOADED*/
    $(window).on("load", function () {
      $(".preloader").fadeOut();
      $(".preloader-area").delay(350).fadeOut("slow");
    });
    /*END PRELOADED*/
    /*START CHANGE MENU BACKGROUND JS*/
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 200) {
        $(".header-top-area").addClass("menu-bg");
      } else {
        $(".header-top-area").removeClass("menu-bg");
      }
    });
    /*END CHANGE MENU BACKGROUND JS*/

    /*START SCROLL TO UP*/
    $(".scrollup").on("click", function () {
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        800
      );
      return false;
    });
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 500) {
        $(".scrollup").fadeIn();
      } else {
        $(".scrollup").fadeOut();
      }
    });

    /*END SCROLL TO UP*/

    /*START MAGNIFICENT POPUP JS*/
    $(".work-popup").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });
    /*END MAGNIFICENT POPUP JS*/

    /*START TESTMONIAL JS*/
    $(".testimonial-list").owlCarousel({
      items: 1,
      autoPlay: true,
      navigation: false,
      theme: "tp-round-button",
      itemsDesktop: [1199, 1],
      itemsDesktopSmall: [980, 1],
      itemsTablet: [768, 1],
      itemsTabletSmall: false,
      itemsMobile: [479, 1],
      autoHeight: true,
      pagination: true,
    });
    /*END TESTMONIAL JS*/

    /*COUNTER UP JS*/
    $(".counter-number").counterUp({
      time: 2000,
      delay: 10,
    });
    /*COUNTER UP JS*/

    /*START WORK JS*/
    $(".work-inner").mixItUp({
      selectors: {
        target: ".mix", // The class applied to the individual items
        filter: ".filter", // The class applied to the filter controls
      },
      load: {
        filter: "all", // This controls what is shown when the page loads; 'all' shows all items
      },
      animation: {
        effects: "fade scale", // This is just an example, you can choose your own effects
      },
    });
    /*END WORK JS*/

    /*START MENU HIDE*/
    $(document).on("click", ".navbar-collapse.in", function (e) {
      if (
        $(e.target).is("a") &&
        $(e.target).attr("class") != "dropdown-toggle"
      ) {
        $(this).collapse("hide");
      }
    });
    /*END MENU HIDE*/

    /*START BOOTSTRAP SCROLL-SPY*/
    $("body").scrollspy({
      target: ".navbar-collapse",
      offset: 195,
    });
    /*END BOOTSTRAP SCROLL-SPY*/

    /*START SMOOTH SCROLL JS*/
    $("a.smoth-scroll").on("click", function (e) {
      var anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(anchor.attr("href")).offset().top - 80,
          },
          1000
        );
      e.preventDefault();
    });
    /*END SMOOTH SCROLL JS*/
  });
})($);
