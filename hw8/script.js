$(document).ready(function(){

/* --------------------
IMAGE SYSTEM
-------------------- */

let images = [
    "imgs/dream1.jpg",
    "imgs/dream2.jpg",
    "imgs/dream3.jpg"
];

let imageIndex = 0;

function showImage(){

    $("#dreamImage")
    .css({
        top: Math.random()*400,
        left: Math.random()*800
    })
    .attr("src", images[imageIndex])
    .fadeIn(2000)
    .animate({
        left: "+=200"
    },4000)
    .fadeOut(2000, function(){

        imageIndex++;
        if(imageIndex >= images.length){
            imageIndex = 0;
        }

        showImage();

    });

}

showImage();


/* --------------------
TEXT SYSTEM
-------------------- */

let texts = [
    "A dream begins...",
    "Memories drift...",
    "Reality bends...",
    "Night whispers...",
    "Morning returns..."
];

let textIndex = 0;

function changeText(){

    $("#dreamText")
    .fadeOut(500,function(){

        $(this)
        .text(texts[textIndex])
        .css({
            top: Math.random()*500,
            left: Math.random()*800
        })
        .fadeIn(500)
        .animate({
            left: "+=100"
        },3000);

    });

    textIndex++;

    if(textIndex >= texts.length){
        textIndex = 0;
    }

}

setInterval(changeText,4000);

changeText();


/* --------------------
SHAPE SYSTEM
-------------------- */

let shapes = [
    {color:"pink", radius:"0%"},
    {color:"blue", radius:"50%"},
    {color:"purple", radius:"20%"}
];

let shapeIndex = 0;

function changeShape(){

    let shape = shapes[shapeIndex];

    $("#shape")
    .css({
        background: shape.color,
        borderRadius: shape.radius,
        top: Math.random()*500,
        left: Math.random()*800
    })
    .animate({
        left: "+=150"
    },2000);

    shapeIndex++;

    if(shapeIndex >= shapes.length){
        shapeIndex = 0;
    }

}

setInterval(changeShape,3000);

changeShape();

});