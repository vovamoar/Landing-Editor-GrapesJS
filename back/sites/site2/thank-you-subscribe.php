<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="format-detection" content="phone=no">
            <meta name="robots" content="index,follow">
    
    <title><?= $translate('components.thank-you-subscribe.meta.title') ?></title>

    
            <link href="ui-resources/style-library/MGKYWzcKe9Ml0jR2.css" rel="stylesheet">
            <link href="ui-resources/style-library/pAF85T4xmQzhOk1j.css" rel="stylesheet">
    
    <link rel="icon" href="favicon.ico">

        <link rel="icon" sizes="192x192" href="<?= $logoPath ?>">
    
    
        <link rel="mask-icon" href="<?= $logoPath ?>" color="blue">
    
    <?php include(__DIR__.'/'.'libs/consent-mode.php'); ?>
</head>

<body>
            <?php include(__DIR__.'/'.'libs/header.php'); ?>
    
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

            <?php include(__DIR__.'/'.'libs/footer.php'); ?>
    
    
            <script src="ui-resources/interactions/sNaainbXk4bbdXhs.js" defer></script>
            <script src="ui-resources/interactions/WVo1UEgaNegN13pu.js" defer></script>
    </body>

</html>
