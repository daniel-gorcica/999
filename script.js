/* LOADER — hned na začátku, aby se zavřel i při chybě v jiné části stránky */
(() => {
    const loader = document.querySelector('#page-loader');
    if (!loader) return;

    const progressBar = loader.querySelector(
        '#loader-progress-bar, #loader-progress, .loader-progress > span, .loader-meter > span'
    );
    const percentLabel = loader.querySelector('#loader-percent');
    const statusLabel = loader.querySelector('#loader-status');
    const shards = loader.querySelector('#loader-shards');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shards && !reducedMotion) {
        const colors = ['var(--pink)', 'var(--cyan)', 'var(--yellow)'];

        for (let index = 0; index < 30; index += 1) {
            const shard = document.createElement('span');
            shard.className = 'loader-shard';
            shard.style.setProperty('--top', `${Math.random() * 100}%`);
            shard.style.setProperty('--left', `${Math.random() * 100}%`);
            shard.style.setProperty('--width', `${50 + Math.random() * 300}px`);
            shard.style.setProperty('--height', `${1 + Math.random() * 4}px`);
            shard.style.setProperty('--angle', `${-18 + Math.random() * 36}deg`);
            shard.style.setProperty('--delay', `${Math.random() * -4}s`);
            shard.style.setProperty('--duration', `${1.2 + Math.random() * 2}s`);
            shard.style.setProperty('--shard-color', colors[index % colors.length]);
            shards.appendChild(shard);
        }
    }

    let pageLoaded = document.readyState === 'complete';
    let loaderClosed = false;
    let progress = 0;
    const startedAt = performance.now();
    const minimumTime = 1800;

    function updateProgress() {
        const target = pageLoaded ? 100 : 90;
        progress += (target - progress) * 0.04;

        if (pageLoaded && progress > 99) progress = 100;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (percentLabel) {
            percentLabel.textContent =
                `${Math.floor(progress).toString().padStart(2, '0')}%`;
        }

        if (pageLoaded && statusLabel) {
            statusLabel.textContent = 'PŘIPRAVENO';
        }

        if (!loaderClosed) {
            requestAnimationFrame(updateProgress);
        }
    }

    function closeLoader() {
        if (loaderClosed) return;

        loaderClosed = true;
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-hidden', 'true');

        /* Pojistka i pro případ, že v CSS chybí pravidlo .is-hidden */
        window.setTimeout(() => {
            loader.remove();
        }, 900);
    }

    function closeAfterMinimumTime() {
        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(0, minimumTime - elapsed);
        window.setTimeout(closeLoader, remaining);
    }

    requestAnimationFrame(updateProgress);

    if (pageLoaded) {
        closeAfterMinimumTime();
    } else {
        window.addEventListener('load', () => {
            pageLoaded = true;
            closeAfterMinimumTime();
        }, { once: true });
    }

    /* Když se nějaký obrázek nebo jiný zdroj zasekne, loader nezůstane viset. */
    window.setTimeout(() => {
        pageLoaded = true;
        closeLoader();
    }, 6000);
})();

/* Částice v plakátovém pozadí */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const particleLayer = document.querySelector('#poster-particles');

if (particleLayer && !reducedMotion) {
    const particleColors = [
        'var(--pink)',
        'var(--cyan)',
        'var(--yellow)',
        'var(--purple)'
    ];

    for (let index = 0; index < 28; index += 1) {
        const particle = document.createElement('span');
        particle.className = 'poster-particle';
        particle.style.setProperty('--left', `${Math.random() * 100}%`);
        particle.style.setProperty('--size', `${2 + Math.random() * 4}px`);
        particle.style.setProperty('--delay', `${Math.random() * -14}s`);
        particle.style.setProperty('--duration', `${9 + Math.random() * 12}s`);
        particle.style.setProperty(
            '--particle-color',
            particleColors[index % particleColors.length]
        );
        particleLayer.appendChild(particle);
    }
}

/* Jemné nájezdy sekcí při běžném scrollování */
const fadeElements = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window && !reducedMotion) {
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    fadeElements.forEach(element => fadeObserver.observe(element));
} else {
    fadeElements.forEach(element => element.classList.add('visible'));
}

/* Mobilní menu */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* Ukazatel pozice při scrollování */
const progressIndicator = document.querySelector('.scroll-progress');

if (progressIndicator) {
    function updatePageProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? window.scrollY / scrollableHeight
            : 0;

        progressIndicator.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updatePageProgress, { passive: true });
    updatePageProgress();
}

/* Jemný parallax plakátového pozadí */
const posterBackground = document.querySelector('.poster-background');
let parallaxFrame = null;

if (posterBackground && !reducedMotion) {
    function updateParallax() {
        posterBackground.style.setProperty(
            '--parallax-y',
            `${window.scrollY * -0.08}px`
        );
        parallaxFrame = null;
    }

    window.addEventListener('scroll', () => {
        if (parallaxFrame === null) {
            parallaxFrame = window.requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
    updateParallax();
}

/* Plakátový vlastní kurzor na zařízeních s přesným ukazatelem */
const customCursor = document.querySelector('.custom-cursor');

if (customCursor && !reducedMotion &&
    window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', event => {
        customCursor.style.setProperty('--cursor-x', `${event.clientX}px`);
        customCursor.style.setProperty('--cursor-y', `${event.clientY}px`);
    });

    document.querySelectorAll('a, button, [role="button"]').forEach(element => {
        element.addEventListener('pointerenter', () => {
            customCursor.classList.add('is-hovering');
        });
        element.addEventListener('pointerleave', () => {
            customCursor.classList.remove('is-hovering');
        });
    });
}

/* Jemný náklon karet alb podle kurzoru */
if (!reducedMotion) {
    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('pointermove', event => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            card.style.transform =
                `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

/* Náhradní obrázek, když se nepodaří načíst obal alba */
document.querySelectorAll('.album-cover img[data-fallback]').forEach(image => {
    image.addEventListener('error', () => {
        image.src = image.dataset.fallback;
    }, { once: true });
});

/* Tracklisty alb */
const albumTracks = {
    goodbye: {
        title: 'Goodbye & Good Riddance',
        year: '2018',
        tracks: [
            'Intro',
            'All Girls Are the Same',
            'Lucid Dreams',
            'Wasted',
            'Armed & Dangerous',
            'Lean Wit Me',
            'I’ll Be Fine',
            'Candles',
            'Scared of Love',
            'Used To',
            'Karma',
            'Hurt Me',
            'Black & White'
        ]
    },

    'death-race': {
        title: 'Death Race for Love',
        year: '2019',
        tracks: [
            'Empty',
            'Maze',
            'HeMotions',
            'Demonz (Interlude)',
            'Fast',
            'Hear Me Calling',
            'Big',
            'Robbery',
            'Flaws and Sins',
            'Feeling',
            'Syphilis',
            'Who Shot Cupid?',
            'Ring Ring',
            'Desire',
            'Out My Way',
            'The Bees Knees',
            'On God',
            '10 Feet',
            'Won’t Let Go',
            'She’s the One',
            'Rider',
            'Make Believe'
        ]
    },

    legends: {
        title: 'Legends Never Die',
        year: '2020',
        tracks: [
            'Anxiety (Intro)',
            'Conversations',
            'Titanic',
            'Bad Energy',
            'Righteous',
            'Blood on My Jeans',
            'Smile',
            'Tell Me U Luv Me',
            'Hate the Other Side',
            'Get Through It (Interlude)',
            'Life’s a Mess',
            'Come & Go',
            'I Want It',
            'Fighting Demons',
            'Wishing Well',
            'Screw Juice',
            'Up Up and Away',
            'The Man, the Myth, the Legend (Interlude)',
            'Stay High',
            'Can’t Die',
            'Man of the Year',
            'Juice WRLD Speaks from Heaven (Outro)'
        ]
    },

    demons: {
        title: 'Fighting Demons',
        year: '2021',
        tracks: [
            'Burn',
            'Already Dead',
            'You Wouldn’t Understand',
            'Wandered to LA',
            'Eminem Speaks',
            'Rockstar in His Prime',
            'Doom',
            'Go Hard',
            'Juice WRLD Speaks',
            'Not Enough',
            'Feline',
            'Relocate',
            'Juice WRLD Speaks 2',
            'Until the Plug Comes Back Around',
            'From My Window',
            'Girl of My Dreams',
            'Feel Alone',
            'My Life in a Nutshell'
        ]
    },

    party: {
        title: 'The Party Never Ends',
        year: '2024',
        tracks: [
            'The Party Never Ends',
            'Misfit',
            'AGATS2 (Insecure)',
            'Lace It',
            'Cuffed',
            'Empty Out Your Pockets',
            'KTM Drip',
            'Love Letter',
            'Condone It',
            'Goodbye (The Kid LAROI)',
            'Party by Myself',
            'Adore You',
            'Celebrate',
            'Jeffrey',
            'Barbarian',
            'Best Friend',
            'Floor It',
            'Oxycodone',
            'Spend It'
        ]
    }
};

/* Otevírání a zavírání tracklistu */
const albumModal = document.querySelector('#album-modal');
const modalTitle = document.querySelector('#modal-title');
const modalYear = document.querySelector('#modal-year');
const modalTracks = document.querySelector('#modal-tracks');
const modalClose = document.querySelector('.modal-close');
let previouslyFocusedAlbum = null;

function closeAlbumModal() {
    if (!albumModal) return;

    albumModal.hidden = true;
    document.body.classList.remove('modal-open');
    previouslyFocusedAlbum?.focus();
}

function openAlbumModal(album) {
    const data = albumTracks[album.dataset.album];
    if (!data || !albumModal || !modalTracks) return;

    modalTitle.textContent = data.title;
    modalYear.textContent = data.year;

    const trackItems = data.tracks.map((track, index) => {
        const item = document.createElement('li');
        const trackNumber = document.createElement('span');

        trackNumber.textContent = String(index + 1).padStart(2, '0');
        item.append(trackNumber, document.createTextNode(track));

        return item;
    });

    modalTracks.replaceChildren(...trackItems);
    previouslyFocusedAlbum = album;
    albumModal.hidden = false;
    document.body.classList.add('modal-open');
    modalClose?.focus();
}

document.querySelectorAll('.album-card[data-album]').forEach(album => {
    album.addEventListener('click', () => openAlbumModal(album));

    album.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAlbumModal(album);
        }
    });
});

modalClose?.addEventListener('click', closeAlbumModal);

albumModal?.addEventListener('click', event => {
    if (event.target === albumModal) {
        closeAlbumModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && albumModal && !albumModal.hidden) {
        closeAlbumModal();
    }
});