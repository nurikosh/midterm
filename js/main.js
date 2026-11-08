// Shared by both pages: the "back to top" button (jQuery).

$(function () {
  const button = $("#to-top");
  let shown = false;

  // show the button after the visitor scrolls down 400px, hide it near the top
  $(window).on("scroll", function () {
    const farDown = $(window).scrollTop() > 400;

    if (farDown && !shown) {
      button.stop(true, true).fadeIn(200);
      shown = true;
    } else if (!farDown && shown) {
      button.stop(true, true).fadeOut(200);
      shown = false;
    }
  });

  // smooth scroll to the top; stop() cancels the old scroll if clicked many times
  button.on("click", function () {
    $("html, body").stop().animate({ scrollTop: 0 }, 600);
  });
});
