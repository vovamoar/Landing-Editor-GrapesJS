<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="subject" content="<?= $translate('components.thank-you-subscribe.meta.title') ?>">
            <meta name="keywords" content="<?= $translate('components.thank-you-subscribe.meta.keywords') ?>" />
            <meta property="og:description" content="<?= $translate('components.thank-you-subscribe.meta.description') ?>" />
            <meta property="og:site_name" content="<?= $domainName ?>" />
            <meta property="og:title" content="<?= $translate('components.thank-you-subscribe.meta.title') ?>" />
            <meta property="og:image" content="<?= $getImage('components.index.mainImage') ?>" />
            <meta name="google" content="nositelinkssearchbox">
            <meta name="rating" content="General">
            <meta name="googlebot" content="index,follow">
            <meta name="format-detection" content="phone=no">
            <meta name="description" content="<?= $translate('components.thank-you-subscribe.meta.description') ?>">
    
    <title><?= $translate('components.thank-you-subscribe.meta.title') ?></title>

    
            <link href="web-assets/interface-styles/NCZGjnDZAZkeUDSJ.css" rel="stylesheet">
            <link href="web-assets/interface-styles/SPUGGXJRgsyEJ0IR.css" rel="stylesheet">
    
    <link rel="icon" href="favicon.ico">

    
        <link rel="apple-touch-icon" href="<?= $logoPath ?>">
    
    
    <?php include(__DIR__.'/'.'fragments/consent-mode.php'); ?>
</head>

<body>
            <?php include(__DIR__.'/'.'fragments/header.php'); ?>
    
    <main class="bg-white">
        <div style="min-height:100svh !important;">
                <div class="vh-100 d-flex justify-content-center align-items-center">
        <div>
            <div class="mb-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg"  width="75" height="75" fill="currentColor"
                    class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
            </div>
            <div class="text-center">
                <h1 data-key="components.thank-you-subscribe.headerText"><?= $translate('components.thank-you-subscribe.headerText') ?></h1>
                <p data-key="components.thank-you-subscribe.headerSecondaryText"><?= $translate('components.thank-you-subscribe.headerSecondaryText') ?></p>
                <a data-key="components.thank-you-subscribe.goHomeButtonLabel" href="/" class="btn <?= $firstBtnBgClassList ?>"><?= $translate('components.thank-you-subscribe.goHomeButtonLabel') ?></a>
            </div>
        </div>
        </div>
    </main>

            <?php include(__DIR__.'/'.'fragments/footer.php'); ?>
    
    
            <script src="web-assets/behaviors/zIeO94j0uFL6MPr3.js" defer></script>
            <script src="web-assets/behaviors/ZmhlgrzNb5eUKY4T.js" defer></script>
    </body>

</html>
