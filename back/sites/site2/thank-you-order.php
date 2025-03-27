<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="subject" content="<?= $translate('components.thank-you-order.meta.title') ?>">
            <meta name="googlebot" content="index,follow">
            <meta property="article:author" content="<?= $domainName ?>" >
            <meta name="google" content="notranslate">
            <meta name="robots" content="index,follow">
            <meta name="rating" content="General">
            <meta property="og:type" content="website" />
            <meta name="format-detection" content="phone=no">
            <meta name="keywords" content="<?= $translate('components.thank-you-order.meta.keywords') ?>" />
            <meta name="description" content="<?= $translate('components.thank-you-order.meta.description') ?>">
            <meta property="og:site_name" content="<?= $domainName ?>" />
    
    <title><?= $translate('components.thank-you-order.meta.title') ?></title>

    
            <link href="ui-resources/style-library/MGKYWzcKe9Ml0jR2.css" rel="stylesheet">
            <link href="ui-resources/style-library/pAF85T4xmQzhOk1j.css" rel="stylesheet">
    
    <link rel="icon" href="favicon.ico">

        <link rel="icon" sizes="192x192" href="<?= $logoPath ?>">
    
        <link rel="apple-touch-icon" href="<?= $logoPath ?>">
    
        <link rel="mask-icon" href="<?= $logoPath ?>" color="blue">
    
    <?php include(__DIR__.'/'.'libs/consent-mode.php'); ?>
</head>

<body>
            <?php include(__DIR__.'/'.'libs/header.php'); ?>
    
    <main class="bg-white">
        <div style="min-height:100svh !important;">
                <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <h1 data-key="components.thank-you-order.headerText" class="display-5 fw-bold"><?= $translate('components.thank-you-order.headerText') ?></h1>
            <p data-key="components.thank-you-order.headerSecondaryText" class="col-md-8 fs-4"><?= $translate('components.thank-you-order.headerSecondaryText') ?></p>
            <a href="/" data-key="components.thank-you-order.goHomeButtonLabel" class="btn  <?= $firstBtnBgClassList ?>  btn-lg" type="button"><?= $translate('components.thank-you-order.goHomeButtonLabel') ?></a>
        </div>
    </div>
        </div>
    </main>

            <?php include(__DIR__.'/'.'libs/footer.php'); ?>
    
    
            <script src="ui-resources/interactions/sNaainbXk4bbdXhs.js" defer></script>
            <script src="ui-resources/interactions/WVo1UEgaNegN13pu.js" defer></script>
    </body>

</html>
