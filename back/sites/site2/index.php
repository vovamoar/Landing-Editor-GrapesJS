<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<meta property="og:locale" content="<?= $locale ?>" />
		<meta name="robots" content="index,follow" />
		<meta name="google" content="notranslate" />
		<meta
			name="keywords"
			content="<?= $translate('components.index.meta.keywords') ?>"
		/>
		<meta
			property="og:description"
			content="<?= $translate('components.index.meta.description') ?>"
		/>
		<meta property="article:author" content="<?= $domainName ?>" />
		<meta
			name="subject"
			content="<?= $translate('components.index.meta.title') ?>"
		/>
		<meta property="og:site_name" content="<?= $domainName ?>" />
		<meta name="rating" content="General" />
		<meta
			property="og:image"
			content="<?= $getImage('components.index.mainImage') ?>"
		/>
		<meta
			name="description"
			content="<?= $translate('components.index.meta.description') ?>"
		/>

		<title><?= $translate('components.index.meta.title') ?></title>

		<link
			href="ui-resources/style-library/MGKYWzcKe9Ml0jR2.css"
			rel="stylesheet"
		/>
		<link
			href="ui-resources/style-library/pAF85T4xmQzhOk1j.css"
			rel="stylesheet"
		/>

		<link rel="icon" href="favicon.ico" />

		<link rel="apple-touch-icon" href="<?= $logoPath ?>" />

		<?php include(__DIR__.'/'.'libs/consent-mode.php'); ?>
	</head>

	<body id="page-top">
		<?php include(__DIR__.'/'.'libs/header.php'); ?>

		<main class="bg-white">
			<section id="index">
				<div class="py-5">
					<div class="container">
						<div class="row align-items-center">
							<div
								class="col-12 col-md-7 col-lg-5 mx-auto mx-lg-0 mb-5 mb-lg-0"
							>
								<div>
									<h2
										data-key="components.index.headerText"
										class="mb-3 display-5 fw-bold"
									>
										<?= $translate('components.index.headerText') ?>
									</h2>
									<p data-key="components.index.bodyText" class="lead mb-4">
										<?= $translate('components.index.bodyText') ?>
									</p>
								</div>
							</div>
							<div class="col-12 col-lg-6 offset-xl-1">
								<img
									data-key="components.index.mainImage"
									class="d-block mx-auto img-fluid"
									src="<?= $getImage('components.index.mainImage') ?>"
									alt="..."
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section id="contact-us">
				<div>
					<div class="container-fluid p-5 pt-0">
						<iframe
							src="<?= $contacts('iframe_src') ?>"
							style="
								width: 100% !important;
								height: 450px !important;
								border: 0;
							"
							allowfullscreen=""
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
						></iframe>
					</div>
					<div class="container-fluid p-5 mt-5">
						<div class="row align-items-center">
							<div class="col-12 col-lg-5 mb-5 mb-lg-0">
								<h2
									data-key="components.contacts.headerText"
									class="display-5 fw-bold mb-5"
								>
									<?= $translate('components.contacts.headerText') ?>
								</h2>
								<h4
									data-key="components.contacts.addressHeaderText"
									class="fw-bold"
								>
									<?= $translate('components.contacts.addressHeaderText') ?>
								</h4>
								<p class="mb-5"><?= $contacts('addresses.' . $locale) ?></p>
								<h4
									data-key="components.contacts.contactsHeaderText"
									class="fw-bold"
								>
									<?= $translate('components.contacts.contactsHeaderText') ?>
								</h4>
								<p data-key="components.contacts.email" class="mb-1">
									<?= $translate('components.contacts.email') ?>
								</p>
								<p data-key="components.contacts.phone" class="mb-0">
									<?= $translate('components.contacts.phone') ?>
								</p>
							</div>
							<div class="col-12 col-lg-6 offset-lg-1">
								<form action="#">
									<input
										data-key="components.contacts.nameLabel"
										class="form-control mb-3"
										type="text"
										placeholder="<?= $translate('components.contacts.nameLabel') ?>"
									/>
									<input
										data-key="components.contacts.emailLabel"
										class="form-control mb-3"
										type="email"
										placeholder="<?= $translate('components.contacts.emailLabel') ?>"
									/>
									<textarea
										data-key="components.contacts.messageLabel"
										class="form-control mb-3"
										name="message"
										cols="30"
										rows="10"
										placeholder="<?= $translate('components.contacts.messageLabel') ?>"
									></textarea>
									<button
										data-key="components.contacts.saveButtonLabel"
										class="btn <?= $firstBtnBgClassList ?> w-100"
									>
										<?= $translate('components.contacts.saveButtonLabel') ?>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>

		<?php include(__DIR__.'/'.'libs/footer.php'); ?>

		<script src="ui-resources/interactions/sNaainbXk4bbdXhs.js" defer></script>
		<script src="ui-resources/interactions/WVo1UEgaNegN13pu.js" defer></script>
	</body>
</html>
