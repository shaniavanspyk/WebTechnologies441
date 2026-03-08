class JusticeSlide {
constructor(title, image, description, author, year){
this.title = title;
this.image = image;
this.description = description;
this.author = author;
this.year = year;
}
}

// SLIDES

let slide1 = new JusticeSlide(
"First Earth Day Demonstrations",
"images/earth-day.jpg",
"The first Earth Day took place on April 22, 1970 when millions of Americans gathered to demand a healthier environment. The demonstrations raised awareness about pollution and environmental protection. The movement helped lead to important environmental laws and protections.",
"Keystone / Getty Images",
"1970"
);

let slide2 = new JusticeSlide(
"Women's March on Washington",
"images/womens-march.jpg",
"The Women's March in January 2017 brought more than half a million people to Washington D.C. Protesters supported gender equality, civil rights, and social justice issues. Millions more joined similar marches around the world.",
"Bettmann / Getty Images",
"2017"
);

let slide3 = new JusticeSlide(
"March on Washington for Jobs and Freedom",
"images/the-march.jpg",
"This historic march took place in 1963 and became one of the most important events in the Civil Rights Movement. Hundreds of thousands gathered peacefully to demand racial equality and economic justice. The march is remembered for Dr. Martin Luther King Jr.'s 'I Have a Dream' speech.",
"U.S. Information Agency",
"1963"
);

let slide4 = new JusticeSlide(
"March for Our Lives Protest",
"images/march-for-our-lives.jpg",
"The March for Our Lives protest took place on March 24, 2018 after the tragic school shooting in Parkland, Florida. Students organized the event to demand stronger laws to prevent gun violence. More than one million people participated nationwide in support of safer communities.",
"Mobilus In Mobili",
"2018"
);

let slide5 = new JusticeSlide(
"2020 Racial Justice Protests",
"images/blm.jpg",
"The 2020 racial justice protests began after the death of George Floyd in Minneapolis. Demonstrations spread across hundreds of cities around the world calling for justice and an end to police brutality. The movement highlighted the need for racial equality and systemic reform.",
"Photojournalists",
"2020"
);

// ARRAY

let slides = [slide1, slide2, slide3, slide4, slide5];

let currentIndex = 0;

// FUNCTION

function showSlide(){

let slide = slides[currentIndex];

document.getElementById("slideImage").src = slide.image;
document.getElementById("slideTitle").textContent = slide.title;
document.getElementById("slideDescription").textContent = slide.description;
document.getElementById("slideAuthor").textContent = slide.author;
document.getElementById("slideYear").textContent = slide.year;

currentIndex++;

if(currentIndex >= slides.length){
currentIndex = 0;
}

}

// BUTTON

document.getElementById("nextBtn").addEventListener("click", showSlide);

// LOAD FIRST SLIDE

showSlide();