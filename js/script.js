$(document).ready(function() {

    $(window).scroll(function(event) {
        /* Act on the event */
        var scrolled = $(window).scrollTop();
        var section01 = $('#section01').offset().top;
        var headerBG = document.querySelector('header');
        var opacitySection = document.querySelector('.section-opacity');
        var gallery01 = document.querySelector('.gallery01_small');
        var logo = document.querySelector('.logo');
        var img_dimond = document.querySelector('.images-award-dimond');
        var img_gold = document.querySelector('.images-award');
        /*-- headerBG.style.opacity=Math.min(1,1-getScroll()*0.002); --*/
        opacitySection.style.opacity = Math.max(0, getScroll() * 0.0007);
        logo.style.opacity = Math.max(0, getScroll() * 0.0007);
        gallery01.style.bottom = Math.min(1000, -70 + getScroll() * 0.1) + "px";

        function getScroll() {
            return window.pageYOffset;
        }

    });

    function counter(e) {
        $('.count').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 3000,
                easing: 'swing',
                step: function(now) {
                    $(this).text(commaSeparateNumber(Math.ceil(now)));
                }
            });
        });
    }

    $('.nav').click(function(e) {
        /* Act on the event */
        $('.menu').css({ top: 0 });
    });


    $('.nav_close').click(function(e) {
        /* Act on the event */
        $('.menu').css({ top: -2000 });
    });



    function commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    }



    $(window).scroll(function(event) {
        /* Act on the event */
        var scrolled = $(window).scrollTop();
        var thankyou = $('#counting04').offset().top;
        if (scrolled >= thankyou - 100) {

            $('#shiva span').html('14000000');
            counter();
        } else {}


       
    });


    var $root = $('html, body');
    $('.btn_start a').click(function() {
        var href = $.attr(this, 'href');
        $root.animate({
            scrollTop: $(href).offset().top
        }, 500, function() {
            window.location.hash = href;
        });
        return false;
    });


});
