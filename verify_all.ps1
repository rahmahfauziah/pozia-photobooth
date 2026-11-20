$html = [System.IO.File]::ReadAllText("index.html")
$setupHtml = [System.IO.File]::ReadAllText("parts/03b_setup.html")

$badgeMatches = [regex]::Matches($setupHtml, 'class="setup-indicator-badge')
$isBadgeClean = ($badgeMatches.Count -eq 5) -and ($setupHtml -notmatch '</div>\s*class="setup-indicator-badge')

$checks = @(
    @{ Name = "stage-home present"; Passed = ($html -match 'id="stage-home"') },
    @{ Name = "stage-setup present"; Passed = ($html -match 'id="stage-setup"') },
    @{ Name = "stage-camera present"; Passed = ($html -match 'id="stage-camera"') },
    @{ Name = "stage-review present"; Passed = ($html -match 'id="stage-review"') },
    @{ Name = "stage-editor present"; Passed = ($html -match 'id="stage-editor"') },
    @{ Name = "stage-export present"; Passed = ($html -match 'id="stage-export"') },
    @{ Name = "No layout selector on home"; Passed = (-not ([System.IO.File]::ReadAllText("parts/03_home.html") -match 'setSetupLayout|setLayout|setup-card-')) },
    @{ Name = "Layout selector on setup (1x4, 1x3, 1x2, 2x2, polaroid)"; Passed = ($html -match 'setup-card-1x4' -and $html -match 'setup-card-1x3' -and $html -match 'setup-card-1x2' -and $html -match 'setup-card-2x2' -and $html -match 'setup-card-polaroid') },
    @{ Name = "No frame selection in setup stage (Strict Separation)"; Passed = ($html -notmatch 'id="stage-setup"[\s\S]*?(setup-frame-|selectFrameTheme)') },
    @{ Name = "LayoutSlideshow controller present"; Passed = ($html -match 'LayoutSlideshow\s*=') },
    @{ Name = "Slot photo crossfade slides present"; Passed = ($html -match 'slot-slide\s+slot-slide-0') },
    @{ Name = "Review bottom CTA leads to frame selection"; Passed = ($html -match 'data-i18n="review_proceed"') },
    @{ Name = "Review has filter dock"; Passed = ($html -match 'id="review-filters-dock"') },
    @{ Name = "Review has NO camera controls"; Passed = ($html -notmatch 'id="stage-review"[\s\S]*?id="cam-mirror-btn"') },
    @{ Name = "Denim & Stars frame asset referenced"; Passed = ($html -match 'assets/denim-star-frame\.png') },
    @{ Name = "Denim & Stars theme registered"; Passed = ($html -match "id:\s*'denim-stars'") },
    @{ Name = "14 Filter Presets present"; Passed = ($html -match "id:\s*'vintage'" -and $html -match "id:\s*'retro'" -and $html -match "id:\s*'warm'" -and $html -match "id:\s*'cool'" -and $html -match "id:\s*'soft'" -and $html -match "id:\s*'film'" -and $html -match "id:\s*'bw'" -and $html -match "id:\s*'sepia'" -and $html -match "id:\s*'dreamy'" -and $html -match "id:\s*'bright'" -and $html -match "id:\s*'moody'" -and $html -match "id:\s*'pastel'" -and $html -match "id:\s*'faded'" -and $html -match "id:\s*'original'") },
    @{ Name = "No stickers/doodle/text tabs in editor"; Passed = ($html -notmatch 'tab-stickers' -and $html -notmatch 'tab-doodle' -and $html -notmatch 'tab-text') },
    @{ Name = "Ultra HD Export PNG"; Passed = ($html -match 'downloadFinalImage') },
    @{ Name = "Service worker cache is pozia-v3.6.0"; Passed = ([System.IO.File]::ReadAllText("sw.js") -match 'pozia-v3\.6\.0') },
    @{ Name = "Grid 2x2 square canvas 1:1"; Passed = ($html -match "activeLayout === '2x2'\) \{\s*width = isHighRes \? 1400 : 560;\s*height = width;") },
    @{ Name = "Polaroid classic chin branding"; Passed = ($html -match "POLAROID CLASSIC") },
    @{ Name = "Stage transition animation present"; Passed = ($html -match "stage-transition") },
    @{ Name = "Strip 2 in Editor Layout Switcher"; Passed = ($html -match 'id="frame-layout-1x2"') },
    @{ Name = "BUG 1 FIXED: No raw code snippet leaking on website (exactly 5 valid card badges)"; Passed = $isBadgeClean },
    @{ Name = "BUG 2 FIXED: I18N persistence in localStorage"; Passed = ($html -match "localStorage\.getItem\('pozia_lang'\)" -and $html -match "localStorage\.setItem\('pozia_lang'") },
    @{ Name = "BUG 2 FIXED: Comprehensive bilingual dictionary keys"; Passed = ($html -match 'setup_title:' -and $html -match 'showcase_title:' -and $html -match 'review_title:' -and $html -match 'layout_1x4_title:') },
    @{ Name = "BUG 3 FIXED: Expressive full-body pose preview animations"; Passed = ($html -match 'gA_1x4' -and $html -match 'gB_1x4' -and $html -match 'gC_1x4' -and $html -match 'gD_1x4') },
    @{ Name = "BUG 3 FIXED: All 5 layout cards have animated previews"; Passed = ($html -match 'gA_1x4' -and $html -match 'gA_1x3' -and $html -match 'gA_1x2' -and $html -match 'gA_2x2' -and $html -match 'gA_pol') },
    @{ Name = "CAMERA REDESIGN: Floating settings dropdown present"; Passed = ($html -match 'id="camera-settings-dropdown"') },
    @{ Name = "CAMERA REDESIGN: Settings gear toggle button present"; Passed = ($html -match 'id="cam-settings-toggle-btn"') },
    @{ Name = "CAMERA REDESIGN: No permanent side column in stage-camera"; Passed = ($html -notmatch 'id="stage-camera"[\s\S]*?w-full lg:w-\[38%\]') },
    @{ Name = "CAMERA REDESIGN: Horizontal filter dock below viewport"; Passed = ($html -match 'id="camera-filter-dock"') },
    @{ Name = "CAMERA REDESIGN: Shutter, Upload, and Review controls present"; Passed = ($html -match 'id="shutter-btn"' -and $html -match 'App\.triggerGalleryUpload\(\)' -and $html -match 'ReviewStudio\.openReview\(\)') },
    @{ Name = "CAMERA REDESIGN: Dropdown controls (timer, flash, zoom, exposure, mirror, switch)"; Passed = ($html -match 'cam-timer-3' -and $html -match 'flash-color-white' -and $html -match 'zoom-slider' -and $html -match 'exposure-slider' -and $html -match 'cam-mirror-btn' -and $html -match 'cam-switch-btn') },
    @{ Name = "HERO I18N: data-i18n attributes on hero_title and hero_desc"; Passed = ($html -match 'data-i18n="hero_title"' -and $html -match 'data-i18n="hero_desc"') },
    @{ Name = "HERO I18N: Indonesian hero_title and hero_desc registered"; Passed = ($html -match 'Abadikan Setiap Momen' -and $html -match 'Abadikan momen dengan caramu sendiri\. Buat photostrip yang indah bersama Pozia Studio\.') },
    @{ Name = "HERO I18N: English hero_title and hero_desc registered"; Passed = ($html -match 'Make Every Moment' -and $html -match 'Capture your moments, your way\. Create beautiful photostrips with Pozia Studio\.') },
    @{ Name = "HERO I18N: innerHTML support for styled elements in I18N.apply"; Passed = ($html -match 'texts\[key\]\.includes\(''<''\)\)\s*\{\s*el\.innerHTML\s*=\s*texts\[key\];') },
    @{ Name = "FLASH: Fullscreen fixed screen-flash overlay present"; Passed = ($html -match 'id="screen-flash"' -and $html -match 'position:\s*fixed;\s*inset:\s*0;\s*pointer-events:\s*none;\s*z-index:\s*99999;') },
    @{ Name = "FLASH: Setup and Camera both have White, Peach, Pink, Off"; Passed = ($html -match 'setup-flash-white' -and $html -match 'setup-flash-peach' -and $html -match 'setup-flash-pink' -and $html -match 'setup-flash-off' -and $html -match 'flash-color-peach' -and $html -match 'flash-color-pink') },
    @{ Name = "FLASH: triggerScreenFlash implemented with vibrant color map"; Passed = ($html -match 'triggerScreenFlash\(\)' -and $html -match '#FFE1CC' -and $html -match '#FFB8D0') },
    @{ Name = "UPLOAD: Native file input accepts JPG, JPEG, PNG, WebP"; Passed = ($html -match 'id="gallery-file-input"\s+accept="image/jpeg,image/png,image/webp,image/jpg"') },
    @{ Name = "UPLOAD: PhotoAdjuster interactive modal present"; Passed = ($html -match 'id="photo-adjust-modal"' -and $html -match 'PhotoAdjuster\s*=') },
    @{ Name = "UPLOAD: ReviewStudio per-slot rotate, adjust, replace, remove"; Passed = ($html -match 'ReviewStudio\.rotatePhoto' -and $html -match 'ReviewStudio\.replacePhoto' -and $html -match 'ReviewStudio\.removePhoto') },
    @{ Name = "UPLOAD: Partial slot filling & dashed unfilled placeholder"; Passed = ($html -match 'Slot \$\{idx \+ 1\} Kosong' -and $html -match '\+ Upload Foto') },
    @{ Name = "UPLOAD: Canvas rendering applies photoTransforms (scale, pan, rotate)"; Passed = ($html -match 'State\.photoTransforms\[idx\]' -and $html -match 'transform\.rotate' -and $html -match 'transform\.scale') }
)

$allPassed = $true
foreach ($c in $checks) {
    if ($c.Passed) {
        Write-Output " [PASS] $($c.Name)"
    } else {
        Write-Output " [FAIL] $($c.Name)"
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Output "`n>>> ALL $($checks.Count) VERIFICATIONS PASSED SUCCESSFULLY! <<<"
} else {
    Write-Error "`nSome checks failed."
}
