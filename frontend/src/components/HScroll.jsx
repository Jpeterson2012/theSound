export default function HScroll({name}){
    let a = document.getElementsByClassName(name)[0]
    // console.log('Scroll width: ' + a.scrollWidth)
    // console.log('Client width: ' + a.clientWidth)
    if (a.scrollWidth > a.clientWidth){
    const scrollers = document.querySelectorAll(`.${name}`)
    if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches) addAnimation()
    function addAnimation(){
        scrollers.forEach(scroller => {
            scroller.setAttribute("data-animated", true);
            // const scrollerInner = document.querySelector(".now-playing__name")
            
            // const scrollerContent = Array.from(scrollerInner.children)
            // console.log(scrollerContent)

            // scrollerContent.forEach((item) => {
            //     const duplicatedItem = item.cloneNode(true);
            //     duplicatedItem.setAttribute("aria-hidden", true);
            //     scrollerInner.appendChild(duplicatedItem);
            // })
        
        })
        
    }
}
else{
    a = document.querySelectorAll(".temp")
    a.forEach(b => {
        b.style.display = 'none'
    })
    const scrollers = document.querySelectorAll(`.${name}`)
    scrollers.forEach(scroller => {
        scroller.setAttribute("data-animated", false);
    })
}
}