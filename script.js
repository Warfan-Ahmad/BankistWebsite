'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');

const section1 = document.querySelector('#section--1');
const tabs  = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

////////////////////////////////////For opening up the model /////////////////////////////////////////
const openModal = function (e) {
  e.preventDefault();//This is added to remove the defualt behaviour of # which scrolls up the page
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
//////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////For Closing the Model////////////////////////////////////////////////
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//////////////////////////////////////////////////////////////////////////////////////////////////////


btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal));
//This is added in order to check all the open model class we have used the querySelectorAll which gets all the list of open Model after that we iterate over them to open the model
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


////////////////////////////////Smooth Scrolling using EVENT DELEGATIONS//////////////////////////////

//In this part of the code we are applying smooth scrolling instead of applying smooth scrolling using the delegation instead of bubbling. so we have selected the parent of the elements and when the click happens on the target we check if the element is nav__link then we scroll.
document.querySelector('.nav__links').addEventListener('click',function(e)
{
  e.preventDefault();
  //Check condition if the click happened on the nav__link
  if(e.target.classList.contains('nav__link'))
  {
    //Check the id of the clicked element using e.target then using that id select that section and scrollviewinto smooth scrolling 
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////Making A tabbed component//////////////////////////////////////
// In this section we have selected all the necessary tabs like the outer container the tab operations and the content area after that we have again used the EVENT DELEGATION to handle the events after that we add and remove the classes of active and the section we want to hide and show


//Adding event on the whole container instead of individual elements
tabsContainer.addEventListener('click',function(e)
{
  //Here we have span element inside the button if we click on that nothing happens so in order to fix that we have used the closest method as it will select its parent which is operations tab and the button has also parent operation tab
  const clicked = e.target.closest('.operations__tab');

  //This is Guard clause which executes if nothing happens
  if(!clicked) return
  //First removing the class active from all the buttons 
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //Adding the class back
  clicked.classList.add('operations__tab--active');
  //First removing the class active from all the content tab and then adding which need to show 
  tabsContent.forEach( t => t.classList.remove('operations__content--active'));
  //Here we are selecting that element which has data set to a number 1 2 3 set and add a class active on that to show.
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


////////////////////////////////////////////Menu Fade Animation///////////////////////////////////////

/* In this part we have used the couple of methods to create an fading effect which are at the bottom of this code... But the best version of this was bind method which essentially bind the this keyword to the value passed */
const handleHover = function(e)
{
  //we check that if the clicked item is a nav link 
  if(e.target.classList.contains('nav__link'))
  {
    const link = e.target;
    //Apart from the link we select all other siblings of nav link we have used closest method to first go to parent and then select the children
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //Looping over all the siblings and checking if the element is not a link then put opacity to this which is the value used by bind method
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));



////////////////////////one way of doing was like this but it didnt followed DRY principle////////////

/*
nav.addEventListener('mouseover',function(e)
{
  if(e.target.classList.contains('nav__link'))
  {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }

});

nav.addEventListener('mouseout',function(e)
{
  if(e.target.classList.contains('nav__link'))
  {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 1;
  }
});

////////////////// The Refactored version was we made one function and called like this///////////////

nav.addEventListener('mouseover',function(e)
{
  handleHover(e,0.5);
});
nav.addEventListener('mouseout',function(e)
{
  handleHover(e,1);
});

//////////////////////////////////The more advanced way is up at the top//////////////////////////////
*/

//////////////////////////////////////////Sticky Menu ////////////////////////////////////////////////

/* This part is implemented using the observer API which observes a part of DOM and does actions as specified*/

const header = document.querySelector('.header');
//This heght is checked in order if we use a responsive design our js dont fail as we dont want to hardcode the stuff this will give height according to the viewport this is used for the margin of the nav bar before entering in the new section
const navHeight = nav.getBoundingClientRect().height;

//This is the call back function which is one of the argument we need to pass to the observer API 
const stickyNav = function(entries)
{
  const [entry] = entries;
  //if the entry is intersecting the false we add the sticky and if not we remove and those values are gained by the observer API
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

//THe second argument we pass is the options 
const options = 
{
  root:null, //Null is to the viewport if it is 100 then we use 1
  threshold:0, 
  rootMargin: `-${navHeight}px`, //It means the margin we provide before entering in the section
}; 

//Observer with two arguments
const headerObserver = new IntersectionObserver(stickyNav,options);

//Calling the observer on the header section
headerObserver.observe(header);

/* 
This is not efficient way as it get triggered everytime we scroll each time which cause performance issue.

//////////////////////////////////////////////////////////////////////////////////////////////////////
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll',function(e)
{
  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

/////////////////////////////////////////////////////////////Reveling Sections////////////////////////////////////////////////////////

/* This section of code does the slide in of the section we start by selecting all the sections of the page */
const allSections = document.querySelectorAll('.section');

//Options for observer API call
const opt = {
  root:null, 
  threshold: 0.15, //After 15% of the section is reveled
};

//Logic of revel section
const revealSection = function(entries,observer)
{
  const [entry] = entries; //Taking the entry elements
  //If the section is not intersecting we just return it back
  if(!entry.isIntersecting) return 
//otherwise we remove the section-- hidden from the target class
  entry.target.classList.remove('section--hidden');
  //we unobserve the these for performace otherwise it will keep adding the observer classes that is why we needed the second agrumnet of observer
  observer.unobserve(entry.target);
}


const sectionObserver = new IntersectionObserver(revealSection,opt);
//Looping over the array of selected sections and calling the observer on each section..... also adding the class section--hidden to each
allSections.forEach(el =>
  {
    sectionObserver.observe(el);
    el.classList.add('section--hidden');
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////Lazy loading Images///////////////////////////////////////////////////////

  /* THis section starts with selecting all the images with data-set because if we sleect all the images it will include every image we have to change only those images whjich have data set thats where the original image is kept */

  //Selecting images with data src attribute
  const imgTarget = document.querySelectorAll('img[data-src]');
//call back funtion of observer API
  const loadImg = function(entries,observer)
  {
    const [entry] = entries;

    //Setting the src to dataset src where original iamge is placing it on the low resoultion image
    entry.target.src = entry.target.dataset.src;
//Adding an event listener on load when the iamge loading is finished then we remove the blur effect we can directly remove it but that would not be good looking
    entry.target.addEventListener('load',function()
    {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }

  const imgObserver = new IntersectionObserver(loadImg,{
    root:null,
    threshold:0,
    rootMargin: `-200px`,
  });

  imgTarget.forEach(img => imgObserver.observe(img));


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  


  ////////////////////////////////////////////////////////Testemonial slider /////////////////////////////////////////////////////////
/* In this part of code i established a testomonial slider it started by selecting all the necessary elements*/
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  
//we need a variable current slide to be 0 which will help the inital slide to be 0
  let currentSlide= 0;
  //The max slide till we have to go is total slides which are a node list and will have a property of length.
  const maxSlide = slides.length;

  //Slide where we need to go function
  const goToSlide = function(slide)
  {
    // In this part there is a calculation done which is to trasnlate X we have to translate it 100% 200% 300% which is achieved by 100 * i(0,1,2) - slide which is passed as argument
    slides.forEach((s,i) => (s.style.transform = `translateX(${100 * (i-slide)}%)`));
  };
//In order to go to next slide we have function which first checks if the slide is less than max slide if it is then we call the function and if not we set the varibale back to 0
  const nextSlide = function()
  {
    if(currentSlide === maxSlide - 1)
    currentSlide = 0;
    else
    currentSlide++;

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const prevoiusSlide = function()
  {
    if(currentSlide === 0)
      currentSlide = maxSlide - 1;
    else
      currentSlide--;
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
//now we have manipulated the DOM from JS we have created a createDot function 
  const createDots = function()
  {
    //each slide after its end it attached a dot which is button and on click changes the slide
    slides.forEach(function( _,i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide= "${i}"></button>`);
  });
  };
//in this part we are adding and removing the class active from the button dots
  const activeDot = function(slide)
  {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));  
    document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
  };
// event listener on the buttons

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click',prevoiusSlide);
//evenet listeners for the key press
  document.addEventListener('keydown', function(e)
  {
    if(e.key === 'ArrowLeft')
    prevoiusSlide();
    if(e.key === 'ArrowRight')
    nextSlide();
  });
//on clicking dot event listener
  dotContainer.addEventListener('click', function(e)
  {
    if(e.target.classList.contains('dots__dot'))
    {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeDot(slide);
    }
  });

//initial function which first set everything before starting
  const init = function()
  { 
    goToSlide(0);
    createDots();
    activeDot(0);
  }
  init()

