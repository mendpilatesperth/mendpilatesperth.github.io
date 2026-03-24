document.addEventListener('DOMContentLoaded', ()=>{
  const buttons = document.querySelectorAll('.menu-btn')
  const pages = document.querySelectorAll('.page')
  const hamburgerBtn = document.querySelector('.hamburger-btn')
  const topMenu = document.querySelector('.top-menu')

  // Hamburger menu toggle
  if(hamburgerBtn){
    hamburgerBtn.addEventListener('click', ()=>{
      hamburgerBtn.classList.toggle('active')
      topMenu.classList.toggle('active')
      hamburgerBtn.setAttribute('aria-expanded', hamburgerBtn.classList.contains('active'))
    })
  }

  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.dataset.target
      setActive(target)
      // Close mobile menu after selection
      if(hamburgerBtn && hamburgerBtn.classList.contains('active')){
        hamburgerBtn.classList.remove('active')
        topMenu.classList.remove('active')
        hamburgerBtn.setAttribute('aria-expanded', 'false')
      }
    })
  })

  // set active page and button, persist selection and update hash
  function setActive(target){
    if(!target) return
    const page = document.getElementById(target)
    if(!page) return
    buttons.forEach(b=>b.classList.toggle('active', b.dataset.target===target))
    pages.forEach(p=>p.classList.toggle('active', p.id===target))
    // persist so refresh restores the same section
    try{ localStorage.setItem('mend.activePage', target) }catch(e){}
    // reflect in the URL (so links/bookmarks work)
    if(history.replaceState) history.replaceState(null, '', '#'+target)
    // scroll to top of page content
    window.scrollTo({top:0,behavior:'smooth'})
    observeFades()
  }

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      entry.target.classList.toggle('visible', entry.isIntersecting)
    })
  },{threshold:0.12})

  function observeFades(){
    observer.disconnect()
    // observe only visible page's fade elements
    document.querySelectorAll('.page.active .fade').forEach(el=>observer.observe(el))
  }

  // initial observe
  // restore previously selected page (hash first, then localStorage)
  const fromHash = location.hash && location.hash.slice(1)
  const fromStorage = (()=>{try{return localStorage.getItem('mend.activePage')}catch(e){return null}})()
  const initial = fromHash || fromStorage || (document.querySelector('.menu-btn.active') && document.querySelector('.menu-btn.active').dataset.target) || (pages[0] && pages[0].id)
  setActive(initial)

  // re-check on resize in case layout changes
  let resTimeout
  window.addEventListener('resize', ()=>{clearTimeout(resTimeout);resTimeout=setTimeout(observeFades,200)})
  
  // Ensure page content is offset below the fixed banner
  function updateBannerHeight(){
    const banner = document.querySelector('.banner')
    if(!banner) return
    const h = banner.offsetHeight
    document.documentElement.style.setProperty('--banner-height', h + 'px')
  }
  // set on load and resize (debounced)
  updateBannerHeight()
  let bhTimeout
  window.addEventListener('resize', ()=>{clearTimeout(bhTimeout);bhTimeout=setTimeout(updateBannerHeight,120)})

  // Form validation - ensure at least email or phone is provided
  const contactForm = document.getElementById('contact-form')
  if(contactForm){
    const emailInput = document.getElementById('email')
    const phoneInput = document.getElementById('phone')
    const emailError = document.getElementById('email-error')
    const phoneError = document.getElementById('phone-error')

    function clearEmailError(){ if(emailError) emailError.textContent = '' }
    function clearPhoneError(){ if(phoneError) phoneError.textContent = '' }

    if(emailInput){
      emailInput.addEventListener('input', ()=>{ clearEmailError() })
    }
    if(phoneInput){
      phoneInput.addEventListener('input', ()=>{ clearPhoneError() })
    }

    function isValidAustralianPhone(raw){
      if(!raw) return false
      const cleaned = raw.replace(/[\s\-()]/g,'')
      let core = ''
      if(cleaned.startsWith('+')){
        if(!cleaned.startsWith('+61')) return false
        core = cleaned.slice(3)
      }else if(cleaned.startsWith('0')){
        core = cleaned.slice(1)
      }else{
        return false
      }
      return (/^4\d{8}$/.test(core) || /^[2378]\d{8}$/.test(core))
    }

    contactForm.addEventListener('submit', (e)=>{
      const email = (emailInput && emailInput.value || '').trim()
      const phone = (phoneInput && phoneInput.value || '').trim()

      if(!email && !phone){
        e.preventDefault()
        alert('Please provide either an email address or phone number so we can contact you back.')
        return
      }

      if(email){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailPattern.test(email)){
          e.preventDefault()
          if(emailError) emailError.textContent = 'Please enter a valid email address.'
          if(emailInput) emailInput.focus()
          return
        }
      }

      if(phone){
        if(!isValidAustralianPhone(phone)){
          e.preventDefault()
          if(phoneError) phoneError.textContent = 'Please enter a valid Australian phone number (e.g. 0423 123 456 or +61 423 123 456).'
          if(phoneInput) phoneInput.focus()
          return
        }
      }

      clearEmailError()
    })
  }
})
