<nav class="navbar navbar-expand-lg <?= $headerBgClassList ?> py-2 mb-5">
    <div class="container-fluid">
        <img src="<?= $logoPath ?>" class="bi ms-2 me-2 d-none d-md-block" height="80">
        <a class="navbar-brand <?= $headerTextClassList ?>" href="#">
            <?= $name ?>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav02"
            aria-controls="nav02" aria-expanded="false" aria-label="<?= $translate('common.header.toggleNavigationLabel') ?>">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav02">
            <ul class="navbar-nav mt-3 mt-lg-0 mb-3 mb-lg-0 ms-lg-3">
                                    <li class="nav-item me-4">
                        <?php include(__DIR__.'/'.'language-selector.php'); ?>
                    </li>
                                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/index.php#index"><?= $translate('components.index.label') ?></a>
                    </li>
                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/digital-privacy"><?= $translate('components.privacy-policy.label') ?></a>
                    </li>
                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/terms-use-conditions"><?= $translate('components.terms-of-use.label') ?></a>
                    </li>
                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/return-and-security"><?= $translate('components.return-policy.label') ?></a>
                    </li>
                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/delivery-management"><?= $translate('components.delivery-policy.label') ?></a>
                    </li>
                                    <li class="nav-item me-4">
                        <a class="nav-link <?= $headerTextClassList ?>" aria-current="page" href="/index.php#submit-request"><?= $translate('components.contacts.label') ?></a>
                    </li>
                                            </ul>
        </div>
        <div class="d-none d-lg-flex" action="">
            <div class="input-group">
                <input class="form-control" type="search" placeholder="<?= $translate('common.header.searchLabel') ?>"
                    aria-label="<?= $translate('common.header.searchLabel') ?>">
                <button class="btn <?= $firstBtnBgClassList ?>" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 24 24" stroke="currentColor"
                        style="width: 24px;height: 24px">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</nav>
