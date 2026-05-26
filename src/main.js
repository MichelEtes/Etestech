import './style.css'
import Lenis from 'lenis'

// ============================================================
// LENIS — smooth scroll
// ============================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ============================================================
// HEADER — scroll state
// ============================================================
const header = document.getElementById('site-header')

lenis.on('scroll', ({ scroll }) => {
  header.classList.toggle('scrolled', scroll > 20)
})

// ============================================================
// NAV — active section highlight via IntersectionObserver
// ============================================================
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav-link')

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const id = entry.target.id
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`
      link.classList.toggle('active', isActive)
    })
  })
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })

sections.forEach(s => sectionObserver.observe(s))

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger')
const mainNav = document.getElementById('main-nav')

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open')
  mainNav.classList.toggle('open', isOpen)
  hamburger.setAttribute('aria-expanded', String(isOpen))
  hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu de navegação')
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

// Close menu on nav link click
mainNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open')
    mainNav.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.setAttribute('aria-label', 'Abrir menu de navegação')
    document.body.style.overflow = ''
  })
})

// ============================================================
// SCROLL REVEAL — fade-up entrance for all .reveal elements
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

// ============================================================
// SMOOTH SCROLL — logo and all anchor links via Lenis
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href')
    if (targetId === '#') return
    const target = document.querySelector(targetId)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -header.offsetHeight, duration: 1.2 })
  })
})

// ============================================================
// CONTACT FORM
// ============================================================
const form = document.getElementById('contact-form')
const submitBtn = document.getElementById('submit-btn')
const feedback = document.getElementById('form-feedback')

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqejyryp'

function showError(fieldId, message) {
  const el = document.getElementById(`${fieldId}-error`)
  const input = document.getElementById(fieldId)
  if (el) el.textContent = message
  if (input) input.classList.add('error')
}

function clearErrors() {
  form.querySelectorAll('.form-error').forEach(el => { el.textContent = '' })
  form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'))
  feedback.className = 'form-feedback'
  feedback.textContent = ''
}

function validateForm(data) {
  let valid = true

  if (!data.nome.trim()) {
    showError('nome', 'Por favor, informe seu nome.')
    valid = false
  }

  if (!data.email.trim()) {
    showError('email', 'Por favor, informe seu e-mail.')
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showError('email', 'Digite um e-mail válido.')
    valid = false
  }

  if (!data.mensagem.trim()) {
    showError('mensagem', 'Por favor, escreva uma mensagem.')
    valid = false
  }

  return valid
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  clearErrors()

  const data = {
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value,
    mensagem: form.mensagem.value,
  }

  if (!validateForm(data)) return

  // Loading state
  submitBtn.classList.add('loading')
  submitBtn.disabled = true

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      feedback.textContent = '✅ Mensagem enviada! Entraremos em contato em breve.'
      feedback.classList.add('success')
      form.reset()
    } else {
      throw new Error('Servidor retornou erro')
    }
  } catch {
    feedback.textContent = '❌ Erro ao enviar. Por favor, tente pelo WhatsApp.'
    feedback.classList.add('error')
  } finally {
    submitBtn.classList.remove('loading')
    submitBtn.disabled = false
    lenis.scrollTo(feedback, { offset: -20, duration: 0.8 })
  }
})

// Real-time clear error on input
form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error')
    const errEl = document.getElementById(`${input.id}-error`)
    if (errEl) errEl.textContent = ''
  })
})
