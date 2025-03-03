import { fetchNUI } from "./fetch.js";
let settingsStatus = false;

export const changeClass = target => {
    if (settingsStatus && target.id != 'home') {
        return;
    } else {
        settingsStatus = false;
    }
    const sidebar = document.getElementsByClassName('sidebar');
    for (let i = 0; i < sidebar.length; i++) {
        sidebar[i].style.color = "white";
        sidebar[i].style.backgroundColor = "#3f464638";
        sidebar[i].style.boxShadow = "0 0 0px var(--main-color)";
    }
    target.classList.add('pop');
    target.style.color = "white";
    target.style.backgroundColor = "var(--main-color)";
    target.style.boxShadow = "0 0 10px var(--main-color)";
    setTimeout(() => {
        target.classList.remove('pop');
    }, 500);

    const allTextElements = document.getElementsByClassName('VetroxDeatils');
    for (let i = 0; i < allTextElements.length; i++) {
        allTextElements[i].style.color = "rgb(190, 190, 190)";
    }

    const targetText = document.getElementById(target.id + 'text');
    if (targetText) {
        targetText.style.color = "white";
    }

    if (target.id != 'settings') {
        const allClass = document.getElementsByClassName('anim');
        if (target.id != 'home') {
            const showClass = document.getElementsByClassName(target.id);
            for (let i = 0; i < allClass.length; i++) {
                allClass[i].style.display = 'none';
            }
            for (let i = 0; i < showClass.length; i++) {
                showClass[i].style.display = 'flex';
            }
            return;
        } else {
            if (window.getComputedStyle(document.querySelector('.settings-container')).getPropertyValue('display') == 'flex') {
                document.querySelector('.anims-container').classList.add('fadeIn');
                document.querySelector('.settings-container').classList.add('fadeOut');
                setTimeout(() => {
                    document.querySelector('.anims-container').style.display = 'flex';
                    document.querySelector('.settings-container').style.display = 'none';
                    document.querySelector('.anims-container').classList.remove('fadeIn');
                    document.querySelector('.settings-container').classList.remove('fadeOut');
                }, 50);
            }
            for (let i = 0; i < allClass.length; i++) {
                allClass[i].style.display = 'flex';
            }
        }
    } else {
        settingsStatus = true;
        if (window.getComputedStyle(document.querySelector('.settings-container')).getPropertyValue('display') != 'flex') {
            document.querySelector('.anims-container').classList.add('fadeOut');
            document.querySelector('.settings-container').classList.add('fadeIn');
            setTimeout(() => {
                document.querySelector('.anims-container').style.display = 'none';
                document.querySelector('.anims-container').style.display = 'none';
                document.querySelector('.settings-container').style.display = 'flex';
                document.querySelector('.anims-container').classList.remove('fadeOut');
                document.querySelector('.settings-container').classList.remove('fadeIn');
            }, 50);
        }
    }
}

export const getStatus = elem => {
    const savedOpts = JSON.parse(localStorage.getItem('animOptions')) || [];
    for (let i = 0; i < savedOpts.length; i++) {
        if (savedOpts[i] == elem.id) {
            savedOpts.splice(i, 1);
            fetchNUI('changeCfg', {type: elem.id, state: true});
            localStorage.setItem('animOptions', JSON.stringify(savedOpts));
            elem.style.color = "rgb(223, 223, 223)";
            localStorage.setItem(`color-${elem.id}`, "rgb(223, 223, 223)");
            return true;
        }
    }
    savedOpts.push(elem.id);
    fetchNUI('changeCfg', {type: elem.id, state: false});
    localStorage.setItem('animOptions', JSON.stringify(savedOpts));
    elem.style.color = "var(--main-color)";
    localStorage.setItem(`color-${elem.id}`, "var(--main-color)");
    return false;
}

export const setDisplay = animType => {
    let currentDisplay = (animType == 'fadeIn' && 'flex') || 'none'
    if (currentDisplay == 'flex') {
        document.querySelector('.body').style.display = currentDisplay;
        document.querySelector('.menu-container').style.display = currentDisplay;
        document.querySelector('.anims-container').style.display = currentDisplay;
    }
    document.querySelector('.body').classList.add(animType);
    document.querySelector('.menu-container').classList.add(animType);
    document.querySelector('.anims-container').classList.add(animType);
    setTimeout(() => {
        if (currentDisplay != 'flex') {
            document.querySelector('.body').style.display = currentDisplay;
            document.querySelector('.menu-container').style.display = currentDisplay;
            document.querySelector('.anims-container').style.display = currentDisplay;
        }
        document.querySelector('.body').classList.remove(animType);
        document.querySelector('.menu-container').classList.remove(animType);
        document.querySelector('.anims-container').classList.remove(animType);
    }, 50);
}

export const changeInfo = (type, titleM, descM) => {
    const title = document.getElementById('info-title');
    const desc = document.getElementById('info-desc');
    if (type) {
        title.textContent = titleM;
        desc.textContent = descM;
    } else {
        title.textContent = 'Info';
        desc.textContent = 'Display info about certain buttons and icons.'
    }
}

// Vetrox https://discord.gg/jc3bxNTD9Y