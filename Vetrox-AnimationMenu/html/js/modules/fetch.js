const doc = document;
const resourceName = window.GetParentResourceName ? GetParentResourceName() : 'anims';

export const fetchNUI = async (cbname, data) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    };
    const resp = await fetch(`https://${resourceName}/${cbname}`, options);
    return await resp.json();
};

const setText = (elem, text) => elem.textContent = text;

const getFavorite = elemId => {
    const id = JSON.parse(localStorage.getItem('favoriteAnims')) || [];
    return id.includes(elemId);
};

export const createPanels = (panelData) => {
    const main = doc.getElementById('anims-holder');
    const old = localStorage.getItem('oldValues');

    if (old !== null && old !== JSON.stringify(panelData)) {
        console.log('You seem to have new animations. Remember to open a pull request on Github so people can enjoy more animations.\nhttps://github.com/BombayV/anims');
        localStorage.setItem('oldValues', JSON.stringify(panelData));
    } else if (old === null) {
        localStorage.setItem('oldValues', JSON.stringify(panelData));
    }

    panelData.forEach(panel => {
        if (panel && panel.type) {
            const block = doc.createElement('div');
            const textBlock = doc.createElement('div');
            const title = doc.createElement('span');
            const subtitle = doc.createElement('span');
            const star = doc.createElement('i');

            block.classList.add('anim', panel.type);
            star.classList.add('fa-regular', 'fa-star', 'star');

            block.id = (panel.dances && panel.dances.dict) || 
                       (panel.scenarios && panel.scenarios.scene) || 
                       (panel.expressions && panel.expressions.expression) || 
                       (panel.walks && panel.walks.style);

            block.setAttribute('data-dances', panel.dances ? JSON.stringify({ dict: panel.dances.dict, anim: panel.dances.anim, duration: panel.dances.duration }) : false);
            block.setAttribute('data-scenarios', panel.scenarios ? JSON.stringify({ sex: panel.scenarios.sex, scene: panel.scenarios.scene }) : false);
            block.setAttribute('data-expressions', panel.expressions ? JSON.stringify({ expressions: panel.expressions.expression }) : false);
            block.setAttribute('data-walks', panel.walks ? JSON.stringify({ style: panel.walks.style }) : false);
            block.setAttribute('data-props', panel.props ? JSON.stringify({ prop: panel.props.prop, propBone: panel.props.propBone, propPlacement: panel.props.propPlacement, propTwo: panel.props.propTwo || false, propTwoBone: panel.props.propTwoBone || false, propTwoPlacement: panel.props.propTwoPlacement || false }) : false);
            block.setAttribute('data-particles', panel.particles ? JSON.stringify({ asset: panel.particles.asset, name: panel.particles.name, placement: panel.particles.placement, rgb: panel.particles.rgb }) : false);
            block.setAttribute('data-shared', panel.shared ? JSON.stringify({ first: panel.shared.first, second: panel.shared.second }) : false);
            block.setAttribute('data-disableMovement', panel.disableMovement ? JSON.stringify({ disableMovement: panel.disableMovement }) : false);
            block.setAttribute('data-disableLoop', panel.disableLoop ? JSON.stringify({ disableLoop: panel.disableLoop }) : false);

            star.addEventListener('click', e => {
                const isSaved = getFavorite(block.id);
                let favs = JSON.parse(localStorage.getItem('favoriteAnims')) || [];

                if (isSaved) {
                    favs = favs.filter(fav => fav !== block.id);
                    localStorage.setItem('favoriteAnims', JSON.stringify(favs));
                    block.classList.remove('favorite');
                    e.target.classList.replace('fa-solid', 'fa-regular');
                } else {
                    favs.push(block.id);
                    localStorage.setItem('favoriteAnims', JSON.stringify(favs));
                    block.classList.add('favorite');
                    e.target.classList.replace('fa-regular', 'fa-solid');
                }
            });

            block.addEventListener('click', e => {
                if (!e.target.classList.contains('star')) {
                    fetchNUI('beginAnimation', {
                        dance: JSON.parse(block.getAttribute('data-dances')),
                        scene: JSON.parse(block.getAttribute('data-scenarios')),
                        expression: JSON.parse(block.getAttribute('data-expressions')),
                        walk: JSON.parse(block.getAttribute('data-walks')),
                        prop: JSON.parse(block.getAttribute('data-props')),
                        particle: JSON.parse(block.getAttribute('data-particles')),
                        shared: JSON.parse(block.getAttribute('data-shared')),
                        disableMovement: JSON.parse(block.getAttribute('data-disableMovement')),
                        disableLoop: JSON.parse(block.getAttribute('data-disableLoop'))
                    }).then((resp) => {
                        fetchNUI('sendNotification', { 
                            type: resp.e ? 'success' : 'error', 
                            message: resp.e ? 'Animation started!' : 'Animation could not load!' 
                        });
                    });

                    block.classList.add('pop');
                    setTimeout(() => {
                        block.classList.remove('pop');
                    }, 300);
                }
            });

            setText(title, panel.title);
            setText(subtitle);

            textBlock.append(title);
            block.append(textBlock, star);
            main.appendChild(block);
        }
    });

    const favorites = JSON.parse(localStorage.getItem('favoriteAnims')) || [];
    const anims = document.getElementsByClassName('anim');

    for (let i = 0; i < anims.length; i++) {
        if (favorites.includes(anims[i].id)) {
            anims[i].classList.add('favorite');
            const starIcon = anims[i].getElementsByClassName("star")[0];
            starIcon.classList.replace('fa-regular', 'fa-solid');
        }
    }
};

// Vetrox https://discord.gg/jc3bxNTD9Y