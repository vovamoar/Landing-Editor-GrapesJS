document.addEventListener('DOMContentLoaded', () => {
	// Mobile menu toggle
	const header = document.querySelector('.header')
	const nav = document.querySelector('.nav')

	// Create mobile menu button
	const menuButton = document.createElement('button')
	menuButton.className = 'mobile-menu-button'
	menuButton.innerHTML = `
        <span class="mobile-menu-icon"></span>
        <span class="mobile-menu-icon"></span>
        <span class="mobile-menu-icon"></span>
    `
	header.querySelector('.header__container').appendChild(menuButton)

	// Toggle mobile menu
	menuButton.addEventListener('click', () => {
		nav.classList.toggle('nav--active')
		menuButton.classList.toggle('mobile-menu-button--active')
	})

	// Smooth scrolling for navigation links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute('href'))
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
				// Close mobile menu if open
				nav.classList.remove('nav--active')
				menuButton.classList.remove('mobile-menu-button--active')
			}
		})
	})

	// Scroll animations
	const animateOnScroll = () => {
		const elements = document.querySelectorAll(
			'.services__item, .contact__form'
		)
		elements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top
			const elementBottom = element.getBoundingClientRect().bottom

			if (elementTop < window.innerHeight && elementBottom > 0) {
				element.classList.add('animate')
			}
		})
	}

	// Initial check for elements in view
	animateOnScroll()
	// Check on scroll
	window.addEventListener('scroll', animateOnScroll)

	// Form submission handling
	const form = document.querySelector('.contact__form')
	form.addEventListener('submit', e => {
		e.preventDefault()

		// Get form data
		const formData = new FormData(form)
		const data = Object.fromEntries(formData)

		// Show success message
		const successMessage = document.createElement('div')
		successMessage.className = 'form__success'
		successMessage.textContent =
			'Thank you for your message! We will get back to you soon.'
		form.appendChild(successMessage)

		// Reset form
		form.reset()

		// Remove success message after 5 seconds
		setTimeout(() => {
			successMessage.remove()
		}, 5000)
	})

	// Header scroll effect
	let lastScroll = 0
	window.addEventListener('scroll', () => {
		const currentScroll = window.scrollY

		if (currentScroll <= 0) {
			header.classList.remove('header--scrolled')
			return
		}

		if (
			currentScroll > lastScroll &&
			!header.classList.contains('header--scrolled')
		) {
			// Scrolling down
			header.classList.add('header--scrolled')
		} else if (
			currentScroll < lastScroll &&
			header.classList.contains('header--scrolled')
		) {
			// Scrolling up
			header.classList.remove('header--scrolled')
		}

		lastScroll = currentScroll
	})
})
