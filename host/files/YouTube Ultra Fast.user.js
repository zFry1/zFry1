// ==UserScript==
// @name         YouTube Ultra Fast
// @namespace    https://github.com/zFry1
// @version      10.0
// @description  Optimizes YouTube for speed by reducing CPU/RAM load, removing blur/transparency, and disabling internal heavy features (like Ambient Lighting).
// @author       zFrxncesck1
// @icon         https://lh3.googleusercontent.com/WmYTd_OV6T02spKBkBFb7HzSDshWEBshMFo_ji3zJasoLQCrN0w3PPDi2511Qf7yFcvpU3qBOAow0KfT_Vq47_WW=s60
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // OPTION: Set to TRUE to force-disable ALL animations on
    //         every element (* selector) across the entire page.
    //         — TRUE  → best raw speed, zero visual effects. Use ONLY if you
    //                   run no other extensions that inject their own animations
    //                   (e.g. SponsorBlock, Return YouTube Dislike, custom
    //                   themes, PreMiD). Those extensions rely on the browser
    //                   default and will break/flicker when overridden by a
    //                   blanket "animation: none !important" on *.
    //         — FALSE → safer with other extensions. Cinematics and YT-internal
    //                   animations are still killed via flags (section A) and
    //                   the targeted player rules below.
    // =========================================================================
    const DISABLE_ALL_ANIMATIONS = false;

    // =========================================================================
    // OPTION: Set to TRUE to remove backgrounds/borders from player controls
    //         (pause, volume, timestamp, subtitles, settings, fullscreen).
    //         Set to FALSE to keep the original YouTube player control style.
    // =========================================================================
    const TRANSPARENT_PLAYER_CONTROLS = false;

    // --- A. Internal Flags (disable animations, cinematics, heavy features) ---

    const flagsToAssign = {
        /*IS_TABLET: true,*/
        polymer_verifiy_app_state: false,
        desktop_delay_player_resizing: false,
        web_animated_actions: false,
        web_animated_like: false,
        web_animated_like_lazy_load: false,
        render_unicode_emojis_as_small_images: true,
        smartimation_background: false,
        kevlar_refresh_on_theme_change: false,
        kevlar_measure_ambient_mode_idle: false,
        kevlar_watch_cinematics_invisible: false,
        web_cinematic_theater_mode: false,
        web_cinematic_fullscreen: false,
        enable_cinematic_blur_desktop_loading: false,
        kevlar_watch_cinematics: false,
        web_cinematic_masthead: false,
        web_watch_cinematics_preferred_reduced_motion_default_disabled: false,
        web_enable_ab_rsp_cl: false,
        ab_pl_man: false
    };

    const applyFlags = () => {
        const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;
        if (expFlags) Object.assign(expFlags, flagsToAssign);
    };

    document.addEventListener('DOMContentLoaded', applyFlags, { once: true });
    window.addEventListener('load', applyFlags, { once: true });

    const cdns = ['https://i.ytimg.com', 'https://i9.ytimg.com', 'https://yt3.ggpht.com'];
    cdns.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        (document.head || document.documentElement).appendChild(link);
    });

    // --- B. CSS Optimizations ---

    const animationsCSS = DISABLE_ALL_ANIMATIONS ? `
        /* Force-disable all animations globally */
        * { animation: none !important; }
    ` : '';

    const ultraFastCSS = `
        /* Disable all transitions, visual effects globally */
        * {
            /*animation: none !important;*/
            transition: none !important;
            text-shadow: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            filter: none !important;
            scroll-behavior: auto !important;
            /*scroll-snap-type: none !important;*/
            font-variant: normal !important;
            letter-spacing: normal !important;
            /*cursor: default !important;*/
            mix-blend-mode: normal !important;
            background-blend-mode: normal !important;
            perspective: none !important;
            transform-style: flat !important;
            outline: none !important;
            text-decoration-skip-ink: none !important;
            hyphens: none !important;
            clip-path: none !important;
            /*box-decoration-break: clone !important;*/
            /*contain-intrinsic-size: auto !important;*/
            isolation: auto !important;
            will-change: auto !important;
            text-emphasis: none !important;
            -webkit-tap-highlight-color: transparent !important;
            font-smooth: never !important;
            font-kerning: none !important;
            image-rendering: optimizeSpeed !important;
            shape-rendering: optimizeSpeed !important;
            text-rendering: optimizeSpeed !important;
            clear: none !important;
            font-style: normal !important;
            font-feature-settings: normal !important;
        }

        /* Scale Shorts to 97%, top-centered */
        .style-scope.ytd-shorts {
            transform: scale(0.97) !important;
            /* transform-origin: top center; */
        }

        /* Hide non-essential UI elements */
        div.yt-content-metadata-view-model__metadata-row.yt-content-metadata-view-model__metadata-row--metadata-row-wrap,
        .ytCoreImageHost.ytwPivotButtonViewModelHostImage.ytCoreImageFillParentHeight.ytCoreImageFillParentWidth.ytCoreImageContentModeScaleToFill.ytCoreImageLoaded,
        #panels-full-bleed-container,
        .ytp-bezel-text-wrapper,
        .ytp-button.ytp-cards-button,
        .ytp-bezel-text,
        .ytp-fullscreen-title,
        .ytp-bezel,
        .ytp-title-channel,
        .ytp-title-expanded-overlay,
        .yt-list-item-view-model.iron-selected,
        .ytp-chrome-top,
        .ytThumbnailOverlayBadgeViewModelHost,
        .ytp-volume-slider-container,
        ytd-watch-metadata yt-button-view-model:not(ytd-video-description-infocards-section-renderer *) .ytSpecButtonShapeNextButtonTextContent {
            display: none !important;
        }

        /* Hide specific buttons (main UI & Shorts) */
        .yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--enable-backdrop-filter-experiment,
        .ytd-shorts-player-controls .yt-spec-button-shape-next--overlay, .ytp-gradient-bottom, .ytp-placeholder,
        .ytd-shorts-player-controls #navigation-buttons {
            display: none !important;
        }

        /* Keep dialog/popup backgrounds opaque */
        #dialog .yt-spec-dialog-modal__backdrop, .ytp-popup, ytd-menu-popup-renderer, ytd-multi-page-menu-renderer {
            opacity: 1 !important;
        }

        /* Hide hover previews, chips, end screens, non-essential overlays */
        ytd-moving-thumbnail-renderer, .ytp-tooltip.ytp-seek-preview, #mouseover-overlay, .ytp-cards-teaser,
        yt-chip-cloud-chip-renderer, .ytLockupAttachmentsViewModelHost, .ytp-endscreen-content {
            display: none !important;
        }
        .ytp-tooltip.ytp-preview, .ytp-tooltip-bg {
            image-rendering: pixelated !important;
            border: none !important;
            background-color: transparent !important;
        }

        /* Hide fullscreen grid buttons */
        .ytp-overlays-container, .ytp-fullscreen-quick-actions,
        button.ytp-fullscreen-grid-expand-button.ytp-button,
        div.ytp-fullscreen-grid-stills-container,
        div.ytp-fullscreen-grid-main-content,
        .ytPlayerQuickActionButtonsHost.ytPlayerQuickActionButtonsHostCompactControls.ytPlayerQuickActionButtonsHostDisableBackdropFilter {
            display: none !important;
        }

        /* Strip backgrounds/effects from player page-level layers (always active) */
        .style-scope.ytd-page-manager.watch-root-element.hide-skeleton, .miniplayer-bar,
        .microformat, .full-bleed-container, .player-container-background.style-scope.ytd-watch-flexy,
        .ytd-player, .style-scope.ytd-player, .video-stream.html5-main-video, .ytp-livebadge-color,
        .ytp-exp-bottom-control-flexbox, .ytp-modern-caption, .ytp-exp-ppp-update,
        .ytp-grid-scrollable, .ytp-delhi-modern-compact-controls, .ytp-delhi-modern, .ytp-delhi-modern-icons,
        .ytp-delhi-horizontal-volume-controls, .ytp-fit-cover-video, .ytp-fine-scrubbing-exp,
        .ytp-cards-teaser-dismissible, .ytp-hide-info-bar, .ytp-disable-bottom-gradient,
        .ytp-autonav-endscreen-cancelled-state, .playing-mode, .ytp-hide-fullscreen-title,
        .ytp-fullscreen-metadata-top, .ytp-heat-map, .ytp-large-width-mode, .ytp-autohide,
        .html5-video-player, .ytp-transparent {
            background: none !important;
        }

        /* Disable transitions/animations on player controls (always active) */
        .ytp-button, .ytp-chrome-controls * {
            animation: none !important;
        }

        /* Hide Upload button */
        a[href="/upload"] {
            display: none !important;
        }

        /* Remove backgrounds from Shorts containers */
        .ytdDesktopShortsVolumeControlsBackgroundScrim,
        .yt-spec-button-shape-next--overlay-dark.yt-spec-button-shape-next--tonal,
        .style-scope.ytd-shorts {
            background: none !important;
            border: none !important;
        }

        /* Hide Watch Later / Add to Queue hover buttons */
        .yt-player-overlay-video-details-renderer, .ytPlayerOverlayVideoDetailsRendererHost,
        .ytp-playlist-menu-button,
        .ytThumbnailHoverOverlayToggleActionsViewModelButton
        .yt-thumbnail-hover-overlay-toggle-actions-view-model {
            display: none !important;
        }
        #frosted-glass.with-chipbar.ytd-app {
            height: 56px !important;
        }

        /* --- C. Ad Hiding --- */

        .ytd-search ytd-shelf-renderer, ytd-merch-shelf-renderer, ytd-action-companion-ad-renderer,
        ytd-display-ad-renderer, ytd-rich-section-renderer, ytd-video-masthead-ad-advertiser-info-renderer,
        ytd-video-masthead-ad-primary-video-renderer, ytd-in-feed-ad-layout-renderer, ytd-ad-slot-renderer,
        ytd-statement-banner-renderer,
        ytd-ads-engagement-panel-content-renderer, #content.ytd-ads-engagement-panel-content-renderer,
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
        ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer), .ytd-video-masthead-ad-v3-renderer,
        div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
        div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
        div#main-container.style-scope.ytd-promoted-video-renderer,
        div#player-ads.style-scope.ytd-watch-flexy, #clarify-box,
        ytd-compact-movie-renderer, yt-about-this-ad-renderer,
        masthead-ad, ad-slot-renderer, yt-mealbar-promo-renderer, statement-banner-style-type-compact,
        tp-yt-iron-overlay-backdrop, #masthead-ad {
            display: none !important;
        }

        /* Re-enable shelf on channels page */
        .style-scope[page-subtype='channels'] ytd-shelf-renderer {
            display: block !important;
        }
    `;

    // --- B2. Optional: transparent player controls (pause, volume, time, subtitles, settings, fullscreen) ---
    // To keep the original YouTube style on these buttons, set TRANSPARENT_PLAYER_CONTROLS = false above.
    const playerControlsCSS = TRANSPARENT_PLAYER_CONTROLS ? `
        .ytp-chrome-controls, .ytp-chrome-bottom, .ytp-time-wrapper, .ytp-left-controls, .ytp-right-controls,
        .ytp-time-display, .ytp-button, .ytp-button[aria-label], .ytp-button[aria-pressed], .ytp-button[disabled],
        .ytp-button:hover, .ytp-button:focus, .ytp-button::after, .ytp-button::before,
        .ytp-button > div, .ytp-button > svg,
        .ytp-rounded-button-bg, .ytp-rounded-button-bg::before, .ytp-rounded-button-bg::after, .ytp-rounded-button-bg div,
        .ytp-volume-panel, .ytp-volume-area, .ytp-settings-button, .ytp-subtitles-button,
        .ytp-fullscreen-button, .ytp-miniplayer-button, .ytp-time-display > span {
            background: none !important;
            backdrop-filter: none !important;
            border: none !important;
        }
    ` : '';

    const finalCSS = animationsCSS + ultraFastCSS + playerControlsCSS;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(finalCSS);
    } else {
        const style = document.createElement('style');
        style.textContent = finalCSS;
        (document.head || document.documentElement).appendChild(style);
    }

})();