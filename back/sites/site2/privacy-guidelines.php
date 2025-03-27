<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="robots" content="index,follow">
            <meta name="subject" content="<?= $translate('components.privacy-policy.meta.title') ?>">
            <meta property="og:locale" content="<?= $locale ?>" />
    
    <title><?= $translate('components.privacy-policy.meta.title') ?></title>

    
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
                <?php include(__DIR__.'/'.'libs/privacy-policy/' . $locale . '.php'); ?>
        </div>
    </main>

            <?php include(__DIR__.'/'.'libs/footer.php'); ?>
    
    
            <script src="ui-resources/interactions/sNaainbXk4bbdXhs.js" defer></script>
            <script src="ui-resources/interactions/WVo1UEgaNegN13pu.js" defer></script>
    </body>

</html>
