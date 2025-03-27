<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="google" content="nositelinkssearchbox">
            <meta name="googlebot" content="index,follow">
            <meta name="subject" content="<?= $translate('components.thank-you-order.meta.title') ?>">
            <meta name="description" content="<?= $translate('components.thank-you-order.meta.description') ?>">
            <meta property="og:type" content="website" />
            <meta name="format-detection" content="phone=no">
            <meta name="keywords" content="<?= $translate('components.thank-you-order.meta.keywords') ?>" />
            <meta property="og:description" content="<?= $translate('components.thank-you-order.meta.description') ?>" />
            <meta property="og:image" content="<?= $getImage('components.index.mainImage') ?>" />
    
    <title><?= $translate('components.thank-you-order.meta.title') ?></title>

    
            <link href="web-assets/interface-styles/NCZGjnDZAZkeUDSJ.css" rel="stylesheet">
            <link href="web-assets/interface-styles/SPUGGXJRgsyEJ0IR.css" rel="stylesheet">
    
    <link rel="icon" href="favicon.ico">

    
    
    
    <?php include(__DIR__.'/'.'fragments/consent-mode.php'); ?>
</head>

<body>
            <?php include(__DIR__.'/'.'fragments/header.php'); ?>
    
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

            <?php include(__DIR__.'/'.'fragments/footer.php'); ?>
    
    
            <script src="web-assets/behaviors/zIeO94j0uFL6MPr3.js" defer></script>
            <script src="web-assets/behaviors/ZmhlgrzNb5eUKY4T.js" defer></script>
    </body>

</html>
