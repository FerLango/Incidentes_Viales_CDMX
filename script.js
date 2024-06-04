function woeContainerHeight() {
  $(".distracted-driving-woes .woe").each(function () {
    woeHeight += $(this).height();
  });
}

var WindowWidth = $(window).width();

//variables that change on resize
if (WindowWidth > 767) {
  var h1YellowBackHeight = "50px";
} else {
  var h1YellowBackHeight = "40px";
}

//first page: loading animations
var tl0 = new TimelineLite();
tl0.from(".first-choice h1 .large-text", 1, { opacity: "0", top: "-100px" });
tl0.from(
  ".first-choice h1 .background-yellow",
  0.75,
  { maxWidth: 0, opacity: "0" },
  "-=.75"
);
tl0.to(".first-choice h1 .background-yellow", 0.5, {
  height: h1YellowBackHeight,
});
tl0.to(
  ".first-choice h1 .smaller-sub-text",
  0.75,
  { maxHeight: "47px", top: 0 },
  "-=.3"
);
tl0.from(".first-choice p", 0.5, { opacity: 0, top: "-25px" }, "-=.15");
tl0.from(".first-choice h2", 0.5, { opacity: 0, top: "-25px" }, "-=.25");
tl0.staggerFrom(".first-choice ul li", 0.75, { opacity: 0 }, 0.2, "-=.1");

//first page: click on a button
$(".buttons li").click(function (event) {
  var distanceH2 = $(".distracted-driving-woes").offset().top;
  var selectedClass = event.target.className;
  var activeClass = "." + selectedClass + "-wrapper";
  var percentage = "";
  var lugar = "";

  if (selectedClass == "Choque sin lesionados") {
    percentage += "46";
	lugar += "1er";
  } else if (selectedClass == "Persona atroppellada") {
    percentage += "10";
	lugar += "3er";
  } else if (selectedClass == "Choque con lesionados") {
    percentage += "29";
	lugar += "2do";
  } else if (selectedClass == "Motociclista caído") {
    percentage += "10";
	lugar += "4to";
  }

  $(".driving-type").text(selectedClass.toUpperCase() + "");
  $(".percent").text(percentage);
  $(".place").text(lugar);
  $("body").addClass("active");
  $(".driving-wrapper").addClass("active");

  var tl = new TimelineLite();
  tl.to(".first-choice", 1, { position: "realative", top: "-100%" })
    .to(
      ".second-choice",
      1,
      { position: "realative", top: "0", height: "initial" },
      "-=1"
    )
    .from(".sub-sections .fa-arrow-circle-up", 1, { opacity: 0 }, "-=.75")
    .from(".yellow-box p", 1, { top: 300 }, "-=.5")
    .from(".car-image-wrapper img", 1, { right: "-100%" }, "-=.5")
    .from(".driving-percentage", 0.5, { opacity: 0, top: "-50px" }, "-=.25")
    .from(".disclaimer", 0.5, { opacity: 0, top: -50 }, "-=.25");
});

$(".buttons li, .what-type-statics .button-statics, .cta")
  .mouseover(function () {
    var event = $(this);
    TweenMax.to(event, 0.25, { borderRadius: "0 20px" });
  })
  .mouseout(function () {
    var event = $(this);
    TweenMax.to(event, 0.25, { borderRadius: "0px" });
  });

//first page: click on back to top
$(".sub-sections .fa-arrow-circle-up").click(function (event) {
  $("body").removeClass("active");
  TweenMax.to(".first-choice", 1, { top: "0%" });
  TweenMax.to(".second-choice", 1, { position: "realative", top: "100%" });
});

//click on intersection li's
var i = 0;
$(".intersection-accidents .ul-column li span").click(function (event) {
  var dataAttribute = $(this).parent().data("accident");
  var clickedItem = $(this).parent().attr("class");
  var timelineImg = "." + dataAttribute + " .column-img-wrapper";
  var timelineP = "." + dataAttribute + " .sub-paragraph";
  var timelineCauser = "." + clickedItem + " .accidnet-causer";
  var exitCauser = "." + clickedItem + " .fa-times";
  var parentToShow = $(".intersection-types").find("." + dataAttribute);

  //counts the ones you've chosen - needs to come before the add class and the add class needs to come before the top 6 animation
  if (!$(this).parent().hasClass("active") && clickedItem !== "no") {
    i++;
  }

  $(this).parent().addClass("active");
  parentToShow.siblings().removeClass("active");
  parentToShow.addClass("active");

  //a top 6 item
  if (clickedItem !== "no") {
    $(parentToShow).siblings().hide();
    var tl2 = new TimelineLite();
    tl2
      .fromTo(
        parentToShow,
        0.75,
        { left: "-200%", display: "none" },
        { left: 0, display: "block" }
      )
      .fromTo(parentToShow, 1, { opacity: 0 }, { opacity: 1 }, "-=.7")
      .fromTo(timelineImg, 0.5, { left: "-300px" }, { left: 0 }, "-=.5")
      .fromTo(
        timelineP,
        0.5,
        { bottom: "-200px", opacity: 0 },
        { bottom: 0, opacity: 1 },
        "-=.5"
      )
      .fromTo(exitCauser, 0.5, { opacity: 0 }, { opacity: 1 }, "-=.5");
  }

  //after you've guessed them all
  if (i == 6) {
    var distanceH2 = $(".distracted-driving-woes").offset().top;
    var tl3 = new TimelineLite();
    tl3.to(".ul-column li.no", 0.5, {
      maxHeight: 0,
      overflow: "hidden",
      padding: 0,
    });
    tl3.to(".intersection-accidents .congrats", 0, { display: "block" });
    tl3.to(".intersection-accidents .congrats span", 0.5, { top: 0 }, "-=.5");
  }
});

$(".column .fa-times").click(function () {
  var hideCard = $(this).parent();
  var tl5 = new TimelineLite();
  tl5.to(hideCard, 1, { left: "-200%", opacity: 0 });
});



// ==================================== SCROLLING ANIMATIONS ==================================== //
var controller = new ScrollMagic.Controller();

var tlCurtain2 = new TimelineMax();
  
    // Add animations for entering the section
    tlCurtain2.from(".graphs-wrapper h2", 1, { top: "-450px" });
	tlCurtain2.from(".graphs-wrapper .car-image", 10, { left: "-450px" });
	    // Create a ScrollMagic scene for entering the section
		var sceneEnter = new ScrollMagic.Scene({
			triggerElement: ".graphs-wrapper",
			triggerHook: "onEnter",
			offset: 203,
			duration: 600,
		})
		.addTo(controller)
		.setTween(tlCurtain2);

// Define the exiting timeline
var tlCurtain2Exit = new TimelineMax();
tlCurtain2Exit.to(".graphs-wrapper h2", 1, { top: "-450px" });
tlCurtain2Exit.to(".graphs-wrapper .car-image", 10, { left: "-450px" });

// Create a ScrollMagic scene for exiting the section
var sceneExit = new ScrollMagic.Scene({
    triggerElement: ".graphs-wrapper",
    triggerHook: 0.1, // Adjusted trigger hook for exiting
    offset: 203, 
    duration: 600 
})
.setTween(tlCurtain2Exit) // Corrected the variable name to match the defined exit timeline
.addTo(controller);

//Intersection
var tlCurtain = new TimelineMax();
tlCurtain.from(".intersection-accidents h2 div", 1, { top: "-450px" });
tlCurtain.from(
  ".intersection-accidents p.intersection-cta span",
  1,
  { top: "-250px" },
  "-=1"
);
tlCurtain.staggerFrom(".arrows span", 0.5, { opacity: 0, top: "-20px" }, 0.2);
tlCurtain.staggerFrom(".ul-column li", 0.25, { opacity: 0 }, 0.15, "-=.5");
tlCurtain.staggerFrom(
  ".accidnet-causer",
  0.5,
  { opacity: 0, left: "-30px" },
  0.2,
  "-=.5"
);

var scene1 = new ScrollMagic.Scene({
  triggerElement: ".intersection-accidents",
  triggerHook: "onEnter",
  offset: 203,
  duration: 500,
})
  .addTo(controller)
  .setTween(tlCurtain);

//call-to-action
var tlCurtain3 = new TimelineMax();
tlCurtain3.from(".call-to-action p", 0.5, { opacity: 0, top: "50px" });
tlCurtain3.from(".call-to-action a", 1, { left: "-25px", opacity: 0 }, "-=.25");

var scene2 = new ScrollMagic.Scene({
  triggerElement: ".call-to-action",
  triggerHook: "onEnter",
  offset: 203,
  duration: 400,
})
  .addTo(controller)
  .setTween(tlCurtain3);

//references
var tlCurtain2 = new TimelineMax();
tlCurtain2.from(".reference h4", 0.5, { opacity: 0 });
tlCurtain2.staggerFrom(".reference ul li", 1, { opacity: 0 }, 0.1);

var scene3 = new ScrollMagic.Scene({
  triggerElement: ".reference",
  triggerHook: "onEnter",
  offset: 203,
  reverse: false,
})
  .addTo(controller)
  .setTween(tlCurtain2);

//Bar graphs
$(".bar-graph").each(function () {
  var percentText = $(this).find(".barPercent").text();
  var percentValue = parseFloat(percentText);
  var adjustedPercent = (percentValue / 100) * 100 + "%";

  var tlCurtain4 = new TimelineMax();
  tlCurtain4.to(this, 2, { width: adjustedPercent, padding: "0px 5px", ease: Power2.easeInOut });

  var scene3 = new ScrollMagic.Scene({
    triggerElement: ".barsWrapper",
    triggerHook: "onEnter",
    offset: 103,
  })
    .addTo(controller)
    .setTween(tlCurtain4);
});
  
  var tlCurtain5 = new TimelineMax();
  tlCurtain5
	.staggerTo(".border-bottom", 1.5, { width: "100%", ease: Power2.easeInOut }, 0.2)
	.staggerTo(".graph-type", 1, { right: 0, ease: Power2.easeInOut }, 0.2, "-=.5")
	.staggerTo(".barPercent", 1.25, { left: 0, ease: Power2.easeInOut }, 0.2);
  
  var scene3 = new ScrollMagic.Scene({
	triggerElement: ".barsWrapper",
	triggerHook: "onEnter",
	offset: 203,
	duration: 500,
  })
	.addTo(controller)
	.setTween(tlCurtain5);



// Loop through each section
$(".section-viz").each(function(index, element) {
    // Create a timeline for entering each section
    var tlSectionEnter = new TimelineMax();
  
    // Add animations for entering the section
    tlSectionEnter.from($(element).find("h2"), 0.7, { opacity: 0, top: "-250px" });
    tlSectionEnter.staggerFrom(
        $(element).find(".block-left p"),
        0.7,
        { opacity: 0, left: "-250px", ease: Power4.easeOut },
        0.2,
        "-=0.5"
    );
    tlSectionEnter.staggerFrom(
        $(element).find(".block-right p"),
        0.7,
        { opacity: 0, right: "-250px", ease: Power4.easeOut },
        0.2,
        "-=0.5"
    );
    tlSectionEnter.from(
        $(element).find(".viz-right"),
        1.5,
        { right: "-250px", opacity: 0, ease: Power4.easeOut },
        "-=0.7"
    );
    tlSectionEnter.from(
        $(element).find(".viz-left"),
        1.5,
        { left: "-250px", opacity: 0, ease: Power4.easeOut }, // Change from 'right' to 'left'
        "-=0.7"
    );
    $(element)
        .find(".table-wrapper")
        .each(function(index, table) {
            tlSectionEnter.from(
                table,
                1.5,
                { opacity: 0, bottom: "-250px", ease: Power4.easeOut },
                "-=0.4"
            );
        });

    // Create a ScrollMagic scene for entering the section
    var sceneEnter = new ScrollMagic.Scene({
        triggerElement: element,
        triggerHook: "onEnter",
        offset: 203,
        duration: 600,
    })
    .addTo(controller)
    .setTween(tlSectionEnter);

    // Create a timeline for exiting each section
    var tlSectionExit = new TimelineMax();
  
    // Reverse the animations defined in the entering timeline
    tlSectionExit.to($(element).find("h2"), 1, { opacity: 0, top: "-250px" });
    tlSectionExit.staggerTo(
        $(element).find(".block-left p"),
       	1,
        { opacity: 0, left: "-250px", ease: Power4.easeIn },
        0.2,
        "-=0.5"
    );
    tlSectionExit.staggerTo(
        $(element).find(".block-right p"),
        1,
        { opacity: 0, right: "-250px", ease: Power4.easeIn },
        0.2,
        "-=0.5"
    );
    tlSectionExit.to(
        $(element).find(".viz-right"),
        1,
        { right: "-250px", opacity: 0, ease: Power4.easeIn },
        "-=0.7"
    );
    tlSectionExit.to(
        $(element).find(".viz-left"),
        1,
        { left: "-250px", opacity: 0, ease: Power4.easeIn },
        "-=0.7"
    );
    $(element)
        .find(".table-wrapper")
        .each(function(index, table) {
            tlSectionExit.to(
                table,
                1.5,
                { opacity: 0, bottom: "-500px", ease: Power4.easeIn },
                "-=0.4"
            );
        });

    // Create a ScrollMagic scene for leaving the section
    new ScrollMagic.Scene({
        triggerElement: element,
        triggerHook: 0.1,
        offset: 100, // Adjusted offset
        duration: 600, // Adjust duration if needed
    })
    .setTween(tlSectionExit)
    .addTo(controller);
});





