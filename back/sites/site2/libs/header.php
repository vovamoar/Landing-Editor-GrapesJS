<header class="site-header sticky-top py-1 mb-5 <?= $headerBgClassList ?>">
    <nav class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <a class="py-2" href="/">
            <img src="<?= $logoPath ?>" class="bi ms-2 me-2 d-none d-md-block" height="80">
        </a>
        <div class="py-2 <?= $headerTextClassList ?>" href="#">
            <?= $name ?>
        </div>
        <div class="py-2 d-none d-md-inline-block">
                            <?php include(__DIR__.'/'.'language-selector.php'); ?>
                    </div>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/index.php#index"><?= $translate('components.index.label') ?></a>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/privacy-guidelines"><?= $translate('components.privacy-policy.label') ?></a>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/app-usage-terms"><?= $translate('components.terms-of-use.label') ?></a>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/user-return"><?= $translate('components.return-policy.label') ?></a>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/delivery-and-cookies"><?= $translate('components.delivery-policy.label') ?></a>
                    <a class="py-2 d-none d-md-inline-block <?= $headerTextClassList ?>" href="/index.php#contact-us"><?= $translate('components.contacts.label') ?></a>
                
    </nav>
</header>
