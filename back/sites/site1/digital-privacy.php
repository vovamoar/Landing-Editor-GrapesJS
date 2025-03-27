<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="google" content="nositelinkssearchbox">
            <meta name="robots" content="index,follow">
            <meta property="og:description" content="<?= $translate('components.privacy-policy.meta.description') ?>" />
            <meta property="og:type" content="website" />
            <meta name="keywords" content="<?= $translate('components.privacy-policy.meta.keywords') ?>" />
            <meta name="google" content="notranslate">
    
    <title><?= $translate('components.privacy-policy.meta.title') ?></title>

    
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
                <?php include(__DIR__.'/'.'fragments/privacy-policy/' . $locale . '.php'); ?>
        </div>
    </main>

            <?php include(__DIR__.'/'.'fragments/footer.php'); ?>
    
    
            <script src="web-assets/behaviors/zIeO94j0uFL6MPr3.js" defer></script>
            <script src="web-assets/behaviors/ZmhlgrzNb5eUKY4T.js" defer></script>
    </body>

</html>
