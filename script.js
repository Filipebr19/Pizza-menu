let cart = [];
let modalQt = 1;
let key;

const get = el => document.querySelector(el);
const getAll = el => document.querySelectorAll(el);


// Listagem das pizzas
pizzaJson.forEach((item, index) => {
    const pizzaItem = get('.models .pizza-item').cloneNode(true);

    //Preencher as informações do pizzaItem.
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price[2]
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Preenchendo e colocando eventos no modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;

        get('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        get('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        get('.pizzaBig img').src = pizzaJson[key].img;
        get('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price[2]
        .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        get('.pizzaInfo--size.selected').classList.remove('selected');
        getAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex === 2) {
                size.classList.add('selected');
            } 

            size.querySelector('span').innerHTML = `${pizzaJson[key].sizes[sizeIndex]}`;
        });

        get('.pizzaInfo--qt').innerHTML = modalQt;

        get('.pizzaWindowArea').style.opacity = 0;
        get('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            get('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    });
    
    
    get('.pizza-area').append(pizzaItem);
});



//Eventos Modal
function closeModal() {
    get('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        get('.pizzaWindowArea').style.display = 'none';
    }, 500)
}
getAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((button) => {
    button.addEventListener('click', closeModal)
});

get('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        get('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
get('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    get('.pizzaInfo--qt').innerHTML = modalQt;
});

getAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        get('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

        get('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price[sizeIndex]
        .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    })
});

get('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(get('.pizzaInfo--size.selected').getAttribute('data-key'));
    let price = pizzaJson[key].price[size];
    let identifier = pizzaJson[key].id+'@'+size;
    let keyIndex = cart.findIndex((item) => item.identifier === identifier);

    if(keyIndex > -1) {
        cart[keyIndex].qt += modalQt;
    }else {
        cart.push({
            identifier,
            id: pizzaJson[key].id,
            size,
            qt: modalQt,
            price
        });
    }
    
    uptadeCart();
    closeModal();
});

get('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        get('aside').style.left = 0; 
    }
});

get('.menu-closer').addEventListener('click', () => {
    get('aside').style.left = '100vw';
});

function uptadeCart() {
    get('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        get('aside').classList.add('show');
        get('.cart--area .cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

         for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = get('.models .cart--item').cloneNode(true);
            subTotal += cart[i].price * cart[i].qt;

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;    
            }

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                    
                } else {
                    cart.splice(i, 1)
                }
                uptadeCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                uptadeCart();
            })


            get('.cart--area .cart').append(cartItem);
        }  

            desconto = subTotal * 0.1;
            total = subTotal - desconto;

            get('.subtotal span:last-child').innerHTML = subTotal
            .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

            get('.desconto span:last-child').innerHTML = desconto
            .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

            get('.total span:last-child').innerHTML = total
            .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            
    } else {
        get('aside').classList.remove('show');
        get('aside').style.left = '100vw';
    }
};

