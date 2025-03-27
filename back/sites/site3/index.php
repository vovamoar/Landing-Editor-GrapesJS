<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Современный лендинг</title>
	<link rel="stylesheet" href="css/styles.css">
</head>

<body class="page">
	<header class="header">
		<div class="header__container">
			<div class="header__logo">
				<img class="header__logo-img" src="/sites/site3/images/logo.webp" alt="Логотип">
			</div>
			<button class="header__menu-toggle" aria-label="Открыть меню">
				<span class="header__menu-icon"></span>
			</button>
			<nav class="header__nav">
				<ul class="header__nav-list">
					<li class="header__nav-item">
						<a href="#about" class="header__nav-link">О нас</a>
					</li>
					<li class="header__nav-item">
						<a href="#services" class="header__nav-link">Услуги</a>
					</li>
					<li class="header__nav-item">
						<a href="#contact" class="header__nav-link">Контакты</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<main class="main">
		<section class="hero">
			<div class="hero__container">
				<h1 class="hero__title">Добро пожаловать на наш сайт</h1>
				<p class="hero__subtitle">Создаем качественные решения для вашего бизнеса</p>
				<button class="hero__button">Начать сотрудничество</button>
			</div>
		</section>

		<section id="about" class="about">
			<div class="about__container">
				<h2 class="about__title">О нас</h2>
				<div class="about__content">
					<div class="about__text">
						<p class="about__description">Мы - команда профессионалов, стремящихся к совершенству в каждом проекте.</p>
					</div>
					<div class="about__image">
						<img class="about__img" src="/sites/site3/images/logo.webp" alt="О нас">
					</div>
				</div>
			</div>
		</section>

		<section id="services" class="services">
			<div class="services__container">
				<h2 class="services__title">Наши услуги</h2>
				<div class="services__grid">
					<div class="services__item">
						<h3 class="services__item-title">Разработка сайтов</h3>
						<p class="services__item-description">Создание современных и функциональных веб-сайтов</p>
					</div>
					<div class="services__item">
						<h3 class="services__item-title">Дизайн</h3>
						<p class="services__item-description">Разработка уникального дизайна для вашего бренда</p>
					</div>
					<div class="services__item">
						<h3 class="services__item-title">Маркетинг</h3>
						<p class="services__item-description">Продвижение вашего бизнеса в интернете</p>
					</div>
				</div>
			</div>
		</section>

		<section id="contact" class="contact">
			<div class="contact__container">
				<h2 class="contact__title">Свяжитесь с нами</h2>
				<form class="contact__form">
					<div class="contact__form-group">
						<input type="text" class="contact__input" placeholder="Ваше имя">
					</div>
					<div class="contact__form-group">
						<input type="email" class="contact__input" placeholder="Ваш email">
					</div>
					<div class="contact__form-group">
						<textarea class="contact__textarea" placeholder="Ваше сообщение"></textarea>
					</div>
					<button type="submit" class="contact__button">Отправить</button>
				</form>
			</div>
		</section>
	</main>

	<footer class="footer">
		<div class="footer__container">
			<p class="footer__copyright">&copy; 2024 Все права защищены</p>
		</div>
	</footer>
	<script src="js/script.js"></script>
</body>

</html>