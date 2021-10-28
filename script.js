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