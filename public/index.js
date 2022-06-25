const homeBanner = document.querySelector('.home-banner');
const homeMessage = document.querySelector('.home-message');
const fromRight = document.querySelectorAll('.from-right')
const fromLeft = document.querySelectorAll('.from-left')
const visible = document.querySelector(".visible")
const servicesPics = document.querySelectorAll(".col-lg-4")
const aboutText = document.querySelector('.about-text')

console.log(screen.width)
if (screen.width < 900)
{
    aboutText.style.opacity = 1;
    aboutText.classList.remove("from-right")

}
const servicesFromRight = document.querySelectorAll(".col-lg-4:nth-child(odd)")
const servicesFromLeft = document.querySelectorAll(".col-lg-4:nth-child(even)")


// the services img divs could not be selected to function with css

servicesFromRight.forEach((one)=>{
    one.classList.add("from-right");
})

servicesFromRight.forEach((one)=>{
    one.classList.add("from-left");
})


let options = {
    threshold:.3
}
const homeObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach((entry)=>{
       if(entry.isIntersecting)
        {   
            entry.target.classList.toggle("visible")
            if(entry.isIntersecting)
             {
                 observer.unobserve(entry.target)
             }
           // console.log(entry.target)
            
        }
    })

},options)


const servicesObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting)
         {   
             entry.target.classList.toggle("visible")
             if(entry.isIntersecting)
             {
                 observer.unobserve(entry.target)
             }
             
         }
     })
},options)

console.log( servicesPics)
homeObserver.observe(homeBanner)
homeObserver.observe(homeMessage)

servicesPics.forEach((one)=>{
    servicesObserver.observe(one)
})

fromLeft.forEach((one)=>{
    homeObserver.observe(one)
})

fromRight.forEach((one)=>{
    homeObserver.observe(one)
})


