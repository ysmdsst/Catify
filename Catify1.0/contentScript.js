// 猫の絵文字の配列（絵文字の一部）
const catEmojis = ['😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😾', '🐈', '😹', '😾', '🐾', '🦁'];

// ウェブページのURLを取得する
const currentUrl = window.location.href;

// Googleの検索ページのURLパターン
const googleSearchUrlPattern = 'https://www.google.';

// オリジナルの画像とテキストを保持するためのマップ
const originalImages = new Map();
const originalTexts = new Map();

// 画像をランダムな猫の画像で置き換える関数
function replaceImagesWithCats() {
    const catohiroshiProbability = 0.003;

    Array.from(document.getElementsByTagName('img')).forEach(img => {
        if (!originalImages.has(img)) {
            originalImages.set(img, img.src);
        }

        if (img.closest('header') && img.src.includes('icon')) {
            fetch('https://api.thecatapi.com/v1/images/search?mime_types=jpg,png')
                .then(response => response.json())
                .then(data => {
                    let catImageUrl = data[0].url;
                    let catImage = new Image();
                    catImage.onload = function () {
                        let width = img.width;
                        let height = img.height;
                        img.src = catImageUrl;
                        img.width = width;
                        img.height = height;
                    };
                    catImage.src = catImageUrl;
                })
                .catch(error => console.error('Error fetching cat image:', error));
        } else if (!img.closest('header')) {
            let useCatohiroshi = Math.random() < catohiroshiProbability;
            if (useCatohiroshi) {
                img.src = 'https://anohito-genzai.com/wp-content/uploads/2019/01/nek2.jpg';
            } else {
                fetch('https://api.thecatapi.com/v1/images/search?mime_types=jpg,png')
                    .then(response => response.json())
                    .then(data => {
                        let catImageUrl = data[0].url;
                        let catImage = new Image();
                        catImage.onload = function () {
                            let width = img.width;
                            let height = img.height;
                            img.src = catImageUrl;
                            img.width = width;
                            img.height = height;
                        };
                        catImage.src = catImageUrl;
                    })
                    .catch(error => console.error('Error fetching cat image:', error));
            }
        }
    });
}

// 日本語の文末を猫語に変換する関数
const nyanEndings = ['ニャ', 'ニャ～', 'ニャ！', 'ニャよ', 'ニャね', 'ニャン', 'ニャーン'];

function convertJapaneseToCatLanguage(text) {
    return text
        .replace(/([^。！？]+)([。！？])/g, (match, p1, p2) => {
            if (p2 === '。' || p2 === '！' || p2 === '？') {
                let randomEnding = nyanEndings[Math.floor(Math.random() * nyanEndings.length)];
                return `${p1}${randomEnding}${getRandomCatEmoji()} `;
            } else {
                return match;
            }
        })
        .replace(/な/g, 'にゃ')
        .replace(/<\/p>/g, () => `${nyanEndings[Math.floor(Math.random() * nyanEndings.length)]}</p>`);
}

function getRandomCatEmoji() {
    return catEmojis[Math.floor(Math.random() * catEmojis.length)];
}

function convertTextToCatLanguage(text) {
    let convertedText = convertJapaneseToCatLanguage(text);
    return convertedText;
}

function replaceTextWithCatLanguage() {
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = textNodes.nextNode()) {
        if (!originalTexts.has(node)) {
            originalTexts.set(node, node.nodeValue);
        }
        node.nodeValue = convertTextToCatLanguage(node.nodeValue);
    }
}

const catSoundUrls = [
    'https://orangefreesounds.com/wp-content/uploads/2022/05/Cute-cat-meow-sound.mp3',
    'https://soundeffect-lab.info/sound/animal/mp3/cat-cry1.mp3',
    'https://soundeffect-lab.info/sound/animal/mp3/cat-cry2.mp3',
    'https://soundeffect-lab.info/sound/animal/mp3/cat-threat1.mp3'
];

function playRandomCatSound() {
    let randomCatSoundUrl = catSoundUrls[Math.floor(Math.random() * catSoundUrls.length)];
    let catSound = new Audio(randomCatSoundUrl);
    catSound.play().catch(error => console.error('Error playing cat sound:', error));
}

function showPawAndPlaySound(event) {
    let pawImage = document.createElement('img');
    pawImage.src = 'https://onwa-illust.com/wp-content/uploads/2020/03/cat-paws_01.png';
    pawImage.style.position = 'absolute';
    pawImage.style.left = `${event.pageX}px`;
    pawImage.style.top = `${event.pageY}px`;
    pawImage.style.pointerEvents = 'none';
    pawImage.style.width = '50px';
    pawImage.style.height = '50px';
    let randomAngle = (Math.random() * 60) - 30;
    pawImage.style.transform = `rotate(${randomAngle}deg)`;
    document.body.appendChild(pawImage);
    setTimeout(() => {
        pawImage.remove();
    }, 3000);
    playRandomCatSound();
}

function toggleExtension() {
    extensionEnabled = !extensionEnabled;
    if (extensionEnabled) {
        replaceImagesWithCats();
        replaceTextWithCatLanguage();
        document.addEventListener('click', showPawAndPlaySound);
    } else {
        originalImages.forEach((src, img) => {
            img.src = src;
        });
        originalTexts.forEach((text, node) => {
            node.nodeValue = text;
        });
        document.removeEventListener('click', showPawAndPlaySound);
        location.reload(); // ページをリロードして元に戻す
    }
}

window.onload = () => {
    if (!currentUrl.includes(googleSearchUrlPattern)) {
        replaceImagesWithCats();
        replaceTextWithCatLanguage();
        document.addEventListener('click', showPawAndPlaySound);
    }
    createReloadButton(); // ボタンを作成
};

function createReloadButton() {
    let reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Catify';
    reloadButton.style.position = 'fixed';
    reloadButton.style.bottom = '10px';
    reloadButton.style.right = '10px';
    reloadButton.style.zIndex = '1000';
    reloadButton.style.padding = '10px 20px';
    reloadButton.style.backgroundColor = '#ffcc00';
    reloadButton.style.color = '#000';
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '5px';
    reloadButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    reloadButton.style.cursor = 'pointer';
    reloadButton.style.fontFamily = 'Arial, sans-serif';
    reloadButton.style.fontSize = '16px';
    reloadButton.style.transition = 'background-color 0.3s, transform 0.3s';

    reloadButton.addEventListener('mouseover', () => {
        reloadButton.style.backgroundColor = '#ffdd44';
        reloadButton.style.transform = 'scale(1.05)';
    });

    reloadButton.addEventListener('mouseout', () => {
        reloadButton.style.backgroundColor = '#ffcc00';
        reloadButton.style.transform = 'scale(1)';
    });

    reloadButton.onclick = () => {
        location.reload();
    };

    document.body.appendChild(reloadButton);
}