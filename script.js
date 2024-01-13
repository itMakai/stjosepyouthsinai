function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
      x.className += " responsive";
    } else {
      x.className = "navbar";
    }
  }

  // maitaining fixed navigation bar
  let navbar = document.querySelector('.navbar');

  let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', function(){
    let newScrollPosition = window.pageXOffset || this.document.documentElement.scrollTop;

    if(newScrollPosition < scrollPosition){
      navbar.classList.add('fixed');

    } else{
      navbar.classList.remove('fixed');

      
    }
    scrollPosition = newScrollPosition;
  });

  // document.querySelector('#contact').addEventListener('click', function(e){
  //   e.preventDefault();

  //   document.getElementById('contact').scrollIntoView({
  //     behavior: 'smooth'
  //   });
  // });


