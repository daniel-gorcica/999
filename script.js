const fadeElements = document.querySelectorAll('.fade-in');

const particleLayer = document.createElement('div');
particleLayer.className = 'particle-layer';
particleLayer.setAttribute('aria-hidden', 'true');
for (let index = 0; index < 32; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${2 + Math.random() * 5}px`);
    particle.style.setProperty('--delay', `${Math.random() * 8}s`);
    particle.style.setProperty('--duration', `${6 + Math.random() * 8}s`);
    particleLayer.appendChild(particle);
}
document.body.prepend(particleLayer);

const shapeLayer = document.createElement('div');
shapeLayer.className = 'shape-layer';
shapeLayer.setAttribute('aria-hidden', 'true');
const shapes = [
    ['shape-999', '999', '12%', '18%'],
    ['shape-999 shape-999-pink', '999', '82%', '32%'],
    ['shape-ring', '', '7%', '72%'],
    ['shape-ring shape-ring-yellow', '', '91%', '78%'],
    ['shape-cross', '+', '88%', '12%'],
    ['shape-cross shape-cross-pink', '+', '18%', '86%']
];

shapes.forEach(([className, content, left, top], index) => {
    const shape = document.createElement('span');
    shape.className = className;
    shape.textContent = content;
    shape.style.left = left;
    shape.style.top = top;
    shape.style.setProperty('--shape-delay', `${index * -1.7}s`);
    shapeLayer.appendChild(shape);
});
document.body.prepend(shapeLayer);

document.querySelectorAll('.album-cover img[data-fallback]').forEach(image => {
    image.addEventListener('error', () => {
        image.src = image.dataset.fallback;
    }, { once: true });
});

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    fadeElements.forEach(element => observer.observe(element));
} else {
    fadeElements.forEach(element => element.classList.add('visible'));
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

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

const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0})`;
}, { passive: true });

const interactiveCards = document.querySelectorAll('.album-card, .quote-card, .stat');
interactiveCards.forEach(card => {
    card.addEventListener('pointermove', event => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const bounds = card.getBoundingClientRect();
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
    });
});

const albumTracks = {
    goodbye: {
        title: 'Goodbye & Good Riddance',
        year: '2018',
        tracks: ['Intro', 'All Girls Are the Same', 'Lucid Dreams', 'Wasted', 'Armed & Dangerous', 'Lean Wit Me', 'I’ll Be Fine', 'Candles', 'Scared of Love', 'Used To', 'Karma', 'Hurt Me', 'Black & White']
    },
    'death-race': {
        title: 'Death Race for Love',
        year: '2019',
        tracks: ['Empty', 'Maze', 'HeMotions', 'Demonz (Interlude)', 'Fast', 'Hear Me Calling', 'Big', 'Robbery', 'Flaws and Sins', 'Feeling', 'Syphilis', 'Who Shot Cupid?', 'Ring Ring', 'Desire', 'Out My Way', 'The Bees Knees', 'On God', '10 Feet', 'Won’t Let Go', 'She’s the One', 'Rider', 'Make Believe']
    },
    legends: {
        title: 'Legends Never Die',
        year: '2020',
        tracks: ['Anxiety (Intro)', 'Conversations', 'Titanic', 'Bad Energy', 'Righteous', 'Blood on My Jeans', 'Smile', 'Tell Me U Luv Me', 'Hate the Other Side', 'Get Through It', 'Life’s a Mess', 'Come & Go', 'I Want It', 'Fighting Demons', 'Wishing Well', 'Screw Juice', 'Up Up and Away', 'The Man, the Myth, the Legend', 'Stay High', 'Can’t Die', 'Man of the Year', 'Juice WRLD Speaks from Heaven']
    },
    demons: {
        title: 'Fighting Demons',
        year: '2021',
        tracks: ['My Life in the Insane', 'Already Dead', 'You Wouldn’t Understand', 'Wandered to LA', 'Evil Twins', 'Doom', 'Go Hard', 'Not Enough', 'Feline', 'Relocate', 'Until the Plug Comes Back Around', 'From My Window', 'Girl of My Dreams', 'Feel Alone', 'My Life in the Insane']
    },
    party: {
        title: 'The Party Never Ends',
        year: '2024',
        tracks: ['The Party Never Ends', 'Misfit', 'AGATS2 (Insecure)', 'Lace It', 'The Way', 'Best Friend', 'Fighting Off Demons', 'Jeffery', 'Barbarian', 'Love Letter', 'Condone It', 'Party by Myself', 'Adore U', 'Celebrate']
    }
};

const albumModal = document.querySelector('#album-modal');
const modalTitle = document.querySelector('#modal-title');
const modalYear = document.querySelector('#modal-year');
const modalTracks = document.querySelector('#modal-tracks');
const closeModal = () => {
    albumModal.hidden = true;
    document.body.classList.remove('modal-open');
};

const openAlbum = album => {
    const data = albumTracks[album.dataset.album];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalYear.textContent = data.year;
    modalTracks.replaceChildren(...data.tracks.map((track, index) => {
        const item = document.createElement('li');
        item.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>${track}`;
        return item;
    }));
    albumModal.hidden = false;
    document.body.classList.add('modal-open');
};

document.querySelectorAll('.album-card[data-album]').forEach(album => {
    album.addEventListener('click', () => openAlbum(album));
    album.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAlbum(album);
        }
    });
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
albumModal.addEventListener('click', event => {
    if (event.target === albumModal) closeModal();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !albumModal.hidden) closeModal();
});
