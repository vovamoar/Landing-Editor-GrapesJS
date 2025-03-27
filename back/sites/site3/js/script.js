// Mobile menu functionality
const menuToggle = document.querySelector('.header__menu-toggle')
const nav = document.querySelector('.header__nav')

menuToggle.addEventListener('click', () => {
	menuToggle.classList.toggle('active')
	nav.classList.toggle('active')
})

// Close mobile menu when clicking on a link
document.querySelectorAll('.header__nav-link').forEach(link => {
	link.addEventListener('click', () => {
		menuToggle.classList.remove('active')
		nav.classList.remove('active')
	})
})

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()
		const target = document.querySelector(this.getAttribute('href'))
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	})
})

// Form submission handling
const contactForm = document.querySelector('.contact__form')
if (contactForm) {
	contactForm.addEventListener('submit', function (e) {
		e.preventDefault()

		// Get form data
		const formData = new FormData(this)
		const data = Object.fromEntries(formData)

		// Show success message
		const successMessage = document.createElement('div')
		successMessage.className = 'contact__success'
		successMessage.textContent = 'Спасибо! Ваше сообщение отправлено.'
		successMessage.style.cssText = `
            background-color: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            text-align: center;
        `

		this.appendChild(successMessage)

		// Reset form
		this.reset()

		// Remove success message after 3 seconds
		setTimeout(() => {
			successMessage.remove()
		}, 3000)
	})
}

// Intersection Observer for scroll animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px',
}

const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1'
			entry.target.style.transform = 'translateY(0)'
		}
	})
}, observerOptions)

// Observe all animated elements
document
	.querySelectorAll(
		'.hero__title, .hero__subtitle, .hero__button, .about__title, .about__content, .services__title, .services__item, .contact__title, .contact__form'
	)
	.forEach(el => {
		observer.observe(el)
	})

// Add hover effect to service items
document.querySelectorAll('.services__item').forEach(item => {
	item.addEventListener('mouseenter', () => {
		item.style.transform = 'translateY(-10px)'
	})

	item.addEventListener('mouseleave', () => {
		item.style.transform = 'translateY(0)'
	})
})

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
	button.addEventListener('click', function () {
		this.style.transform = 'scale(0.95)'
		setTimeout(() => {
			this.style.transform = 'scale(1)'
		}, 100)
	})
})
