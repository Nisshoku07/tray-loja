function toReal(value, str_cifrao) {
    return str_cifrao + ' ' + value.formatMoney(2, ',', '.');
}

Number.prototype.formatMoney = function (precision = 2, decimal = '.', thousands = ',', withCurrency = false) {

    const placeholderRegex = /{{\s*(\w+)\s*}}/;
    const format = 'R$ {{amount}}';

    let number = this.toFixed(precision);

    let parts = number.split('.');
    let dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
    let centsAmount = parts[1] ? decimal + parts[1] : '';
    let value = dollarsAmount + centsAmount;

    return (withCurrency) ? format.replace(placeholderRegex, value) : value;

}



var cart = {
    customerId: null,
    loadCustomerId: function () {

        if (!cart.customerId) {
            const customerInfo = dataLayer.find(element => ('customerId' in element));
            cart.customerId = customerInfo ? customerInfo.customerId : null;
        }
    },
    session: function () {

        if (jQuery("html").attr('data-session')) {
            return jQuery("html").attr("data-session");

        } else {
            return '';

        }

    },
    idStore: function () {

        return jQuery("html").attr("data-store");
    },


    removeCart: function () {

        jQuery.ajax({
            method: "DELETE",
            url: "/web_api/carts/" + cart.session(),
            success: function (response) {
                cart.listProduct();
            },
            error: function (error) {
                cart.listProduct();
            }
        });
    },
    showCart: function () {

        cart.listProduct();
        jQuery('.header').removeClass('move-down-nenza');
        jQuery('.header').addClass('move-up-nenza');
        jQuery('.modal-theme').removeClass('active');
        jQuery('.cart-sidebar').addClass('active');
        jQuery('.cart-header').addClass('active');

        jQuery('.shadow-float-add-cart').removeClass('active');
        jQuery('.float-add-cart.active').removeClass('active');

    },
    templateProduct: function (id, variant, variantName, name, image, qnt, price, url, addMsg, infoKit, together) {

        var template =
            '<div class="item">'
            + '<div class="box-cart flex align-center">'
            + '<div class="box-image">'
            + '<a href="{url}" class="image">'
            + '<img src="{image}" alt="{name}">'
            + '</a>'
            + '</div>'
            + '<div class="info-product">'
            + '<div class="line-top flex justify-between">'
            + '<a href="{url}" class="name t-color">{name}</a>'
            + '<div class="qnt"><b>Quantidade:</b> {length}</div>'
            + '<div class="remove" data-id="{id}" data-variant="{variant}" data-together="{together}" data-add="{addMsg}" onclick="cart.removeProduct(this)">'
            + '<span class="ic-trash">'
            + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><circle cx="256" cy="256" r="256" fill="#daa369" transform="rotate(-45 255.972 256.066)" data-original="#ff3f5b" class=""></circle><path fill="#ffffff" fill-rule="evenodd" d="M337.185 149.911h-35.509V131a10 10 0 0 0-10-10h-71.352a10 10 0 0 0-10 10v18.911h-35.509a26.881 26.881 0 0 0-26.85 26.85v16.849a10 10 0 0 0 10 10h4.3v149.31a38.123 38.123 0 0 0 38.08 38.08h111.31a38.122 38.122 0 0 0 38.083-38.079V203.609h4.3a10 10 0 0 0 10-10V176.76a26.881 26.881 0 0 0-26.849-26.849zM230.324 141h51.352v8.913h-51.352zm-62.359 35.76a6.94 6.94 0 0 1 6.85-6.848h162.37a6.941 6.941 0 0 1 6.849 6.85v6.85H167.965zm161.773 176.159A18.1 18.1 0 0 1 311.655 371h-111.31a18.1 18.1 0 0 1-18.083-18.08V203.609h147.476zM246 342.96V231.649a10 10 0 0 1 20 0V342.96a10 10 0 1 1-20 0zm-41.869 0V231.649a10 10 0 0 1 20 0V342.96a10 10 0 0 1-20 0zm83.738 0V231.649a10 10 0 0 1 20 0V342.96a10 10 0 0 1-20 0z" data-original="#ffffff" class=""></path></g></svg>'
            + '</span>'
            + '</div>'
            + '</div>'
            + '<div class="line-down">'
            + (
                variantName != undefined ?
                    '<div class="variant"><b>Varia\u{E7}\u{E3}o:</b><small>{variantName}</small></div>' : ''
            )
            + '<div class="price">{price}</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            ;

        template = template.replace(/{url}/g, url);
        template = template.replace(/{image}/g, image);
        template = template.replace(/{name}/g, name);
        template = template.replace(/{id}/g, id);
        template = template.replace(/{variant}/g, variant);
        template = template.replace(/{variantName}/g, variantName);
        template = template.replace(/{length}/g, qnt);
        template = template.replace(/{addMsg}/g, addMsg);
        template = template.replace(/{together}/g, together);
        price = toReal(parseFloat(price), 'R$');
        template = template.replace(/{price}/g, price);
        return template;
    },
    addVariantComplete: function (variant, quantity, productId) {

        cart.loadCustomerId();

        const data = {
            Cart: {
                session_id: cart.session(),
                product_id: productId,
                variant_id: variant ? variant : 0,
                quantity: quantity
            }
        };

        if (cart.customerId) {
            data.Cart.customer_id = cart.customerId;
        }
        jQuery.ajax({
            method: 'post',
            url: '/web_api/cart/',
            dataType: 'json',
            data: data,
            success: function (response, textStatus, jqXHR) {
                cart.showCart();
            },
            error: function (jqXHR, status, errorThrown) {
                window.location.href = jQuery('.modal-product').find('.name a').attr('href');
            }
        });

        /*var customerId = dataLayer[0].customerId ? dataLayer[0].customerId : 0;
        jQuery.ajax({
            method: "POST",
            url: "/web_api/cart/",
            contentType: "application/json; charset=utf-8",
            data:'{"Cart":{"session_id":"' + cart.session() + '","product_id":"' + productId + '","quantity":"' + quantity + '","variant_id":"' + variant + '", "customer_id": "1"}}',
            success: function( response, textStatus, jqXHR ) {
                cart.showCart();
            },  
            error: function( jqXHR, status, errorThrown ){
                window.location.href = jQuery('.modal-product').find('.name a').attr('href');
            }   
        });*/
    },
    filterVariant: function (variants, selects) {

        var i = 0;
        var select = selects.eq(0).val();
        if (selects.eq(1).is(':checked')) {

            if (!!select) {
                var select2 = selects.eq(1).val();
                while (i < variants.length) {
                    if (variants[i].option == select && variants[i].option2 == select2) {
                        return variants[i];
                    }
                    i++;
                }
            }
        } else {
            while (i < variants.length) {
                if (variants[i].option == select && variants[i].option) {
                    return variants[i];
                }
                i++;
            }
        }

        return 500;
    },

    updateUrlPageProduct: function (url, param, paramVal) {
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split('=')[0] != param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }

        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    },

    stockAlert: function (e) {
        var variant = cart.filterVariant(jQuery(e).data('variants'), jQuery(e).find('input:checked'));
        var prodId = e[0].dataset.id;
        var imgVariant = variant.image_variant;

        var labelFirstValue = jQuery(e).find('.first-label input:checked').val();
        var labelSecondVariant = jQuery(e).find('.second-label');
        var listVariants = jQuery(e).data('variants');


        var i = 0, l = 0;

        while (l < labelSecondVariant.length) {
            labelSecondVariant[l].classList.add("out-stock");
            l++;
        }

        while (i < listVariants.length) {
            var j = 0;

            while (j < labelSecondVariant.length) {


                if (listVariants[i].option2 == labelSecondVariant[j].dataset.namevariant && listVariants[i].option == labelFirstValue) {
                    if (listVariants[i].stock <= 0) {
                        labelSecondVariant[j].classList.add("out-stock");
                    } else {
                        labelSecondVariant[j].classList.remove("out-stock");
                    }
                }
                j++;
            }


            i++;
        }



        if (jQuery(e).hasClass("page-product-cart")) {

            var url = "/web_api/variants/" + variant.id;
            theme.variantImage(url);

            var quant = Number(e.find('input[type="number"]').val());
            e.find('input[type="number"]').attr('max', variant.stock).attr('data-variant', variant.id);

            cart.updateUrlPageProduct(window.location.href, "variant_id", variant.id);

            var newURL = cart.updateUrlPageProduct(window.location.href, "variant_id", variant.id);
            newURL = cart.updateUrlPageProduct(newURL, "variant_id", variant.id);

            window.history.replaceState('', '', cart.updateUrlPageProduct(window.location.href, "variant_id", variant.id));


            if (variant.stock == 0 || variant == 500) {
                jQuery(e).find("input:checked").parent("label").addClass("sem__estoque__variation");
            } else {
                var removenostock = document.querySelectorAll(".sem__estoque__variation");
                removenostock.forEach((remove) => {
                    remove.classList.remove("sem__estoque__variation");
                })
            }
        } else {
            var quant = Number(e.find('input.quanti-var[type="number"]').val());
            e.find('input.quanti-var[type="number"]').attr('max', variant.stock).attr('data-variant', variant.id);

        }

        console.log("variant: ", variant)



        var numberFormat = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });
        var price = typeof variant.price?.price != 'undefined' ? numberFormat.format(variant.price?.price) : "indisponivel";
        var priceoff = typeof variant.price?.priceoff != 'undefined' ? variant.price?.priceoff : "indisponivel";
        var payment = typeof variant.price?.payment != 'undefined' ? variant.price?.payment : "indisponivel";



        jQuery('.img-variants-' + prodId + ' img').attr('src', imgVariant);
        jQuery('.img-variants-' + prodId).addClass('active');


        if (priceoff > 0) {
            var paymentOptions = `<div class="price-before"><span class="line-price">${price}</span></div>`;
            var paymentoff = `<div class="price-off new-price">${numberFormat.format(priceoff)}</div>`;
        } else {
            var paymentOptions = `<div class="price-off new-price">${price}</div>`;

        }
        if (jQuery('html').hasClass('page-product')) {
            if (price != "indisponivel") {
                jQuery('#preco_atual').val(variant.price.price);

            }
        }
        var listPayment = '';

        if (payment != "indisponivel") {
            payment.reverse();

            payment.forEach((pay) => {
                if (pay.plots > 1 && pay.tax <= 0) {
                    listPayment +=

                        '<div class="item-payment payment-credit-card">'
                        + 'ou ' + pay.plots + 'x de'
                        + '<b> R$ ' + pay.value.replace('.', ',') + '</b>'
                        + ' sem juros no cart\u{E3}o'
                        + '</div>'
                } else if (pay.plots > 1 && pay.tax > 0) {
                    listPayment +=

                        '<div class="item-payment payment-credit-card">'
                        + 'ou ' + pay.plots + 'x de'
                        + '<b> R$ ' + pay.value.replace('.', ',') + '</b>'
                        + ' com juros no cart\u{E3}o'
                        + '</div>'
                } else if (pay.type == "bank_billet") {
                    listPayment +=

                        '<div class="item-payment item-payment-pix">'
                        + 'ou <b> R$ ' + pay.value.replace('.', ',') + '</b>'
                        + ' Boleto'
                        + '</div>'
                } else if (pay.type == "pix") {
                    listPayment +=

                        '<div class="item-payment item-payment-pix">'
                        + 'ou <b> R$ ' + pay.value.replace('.', ',') + '</b>'
                        + ' PIX'
                        + '</div>'
                }
            });

            if (priceoff > 0) {
                var contentPayments = '<div class="product-price">{priceOff}{pricebefore}</div>'
                contentPayments = contentPayments.replace(/{pricebefore}/g, paymentoff);
                contentPayments = contentPayments.replace(/{priceOff}/g, paymentOptions);
                // contentPayments = contentPayments.replace(/{payments}/g, listPayment);

            } else {
                var contentPayments = '<div class="product-price">{priceOff}</div>'
                contentPayments = contentPayments.replace(/{priceOff}/g, paymentOptions);
                // contentPayments = contentPayments.replace(/{payments}/g, listPayment);
            }

        }

        // contentPayments = contentPayments.replace(/{payments}/g, listPayment);


        e.closest('.product').find('.down-line .box-price .price .recebe-preco-principal').html(contentPayments);
        e.closest('.product').find('.down-line .box-price .price .recebe-preco-parcelado .box-price').html(listPayment);



        if (jQuery(e).hasClass("page-product-cart")) {
            console.log("apenas um teste");

            console.log(e.find('.box-price .price .recebe-preco-principal'));
            e.find('.box-price .price .recebe-preco-principal').html(contentPayments);
            e.find('.box-price .price .recebe-preco-parcelado .box-price').html(listPayment);
        }

        if (jQuery('html').hasClass('page-product')) {
            jQuery('#form_comprar .box-price.box-nenza-price').html(contentPayments);
            jQuery('#selectedVariant').val(variant.id);
        }

        if (variant == 500 || variant == '') {
            console.log("apebas um teste")
            jQuery(e).addClass('dont-stock');
            jQuery(e).find('.add-cart button').removeClass('approve').addClass('dont-stock');
        } else {
            var button = jQuery(e).find('button');
            cart.checkQuantCart(prodId, variant.id, quant, variant.stock, button);
            if (Number(variant.stock) <= 0) {
                jQuery(e).addClass('dont-stock');
                button.addClass('dont-stock');
                button.removeClass('approve');
            } else {
                jQuery(e).removeClass('dont-stock');
                button.removeClass('dont-stock');
                button.addClass('approve');

            }
        }

    },
    checkQuantCart: function (prodId, variantId, quantyImput, variantStock, button) {
        button.addClass('load-stock');
        jQuery.ajax({
            method: 'GET',
            url: '/checkout/cart/api?session_id=' + cart.session() + '&store_id=' + cart.idStore() + '&nocache=0.' + new Date().getTime(),
            success: function (r) {
                var forList = r.data.cart.products;
                var addList = [];

                forList.forEach(function (list) {
                    addList.push({
                        "Cart": {
                            "product_id": list.id,
                            "quantity": list.quantity,
                            "variant_id": list.variant_id || "0",
                        }
                    })
                });

                // cart.forProduct(addList);

                addList.forEach((prodList) => {
                    if (prodId == prodList.Cart.product_id && variantId == prodList.Cart.variant_id) {
                        if (prodList.Cart.quantity >= variantStock) {
                            button.addClass('dont-stock');
                            button.removeClass('load-stock');
                            button.removeClass('approve');


                        } else {
                            button.removeClass('load-stock');
                            button.removeClass('dont-stock');
                            button.addClass('approve');

                        }
                    } else {
                        button.removeClass('load-stock');
                        button.removeClass('dont-stock');
                        button.addClass('approve');


                    }
                })

            },
            error: function () {
                // cart.forProduct([]);
                button.removeClass('load-stock');
                button.removeClass('dont-stock');
                button.addClass('approve');

                return
            }
        });
    },
    initAdd: function () {
        const $body = jQuery('body');

        // Garante que a quantidade mínima é 1
        $body.on('change', '.add-cart input', function () {
            let total = Number(jQuery(this).val());
            jQuery(this).val(total > 0 ? total : 1);
        });

        // Lida com seleção de variantes
        $body.on('change', '.list-variants input', function () {
            const $form = jQuery(this).closest('.list-variants');

            if (jQuery(this).hasClass('first')) {
                $form.find('.second:checked').prop('checked', false);

                if ($form.find('.second').val() || !$form.find('.second').length) {
                    cart.stockAlert($form);
                }
            } else {
                if ($form.find('.first:checked').val()) {
                    cart.stockAlert($form);
                }
            }
        });

        // Submit do formulário
        $body.on('submit', '.list-variants', function (e) {
            e.preventDefault();
            const $form = jQuery(this);
            const hasFirst = $form.find('.first').length > 0;
            const hasSecond = $form.find('.second').length > 0;
            const firstChecked = $form.find('.first:checked').length > 0;
            const secondChecked = $form.find('.second:checked').length > 0;
            console.log($form.find('.errorCartNenza'))
            const showError = (target) => {
                target.find('span').html("Selecione cor e tamanho.");
                target.addClass('active');
                $form.addClass("required");
                setTimeout(() => {
                    target.find('span').html('');
                    target.removeClass('active');
                    $form.removeClass("required");
                }, 5000);
            };

            if (hasFirst && hasSecond) {
                if (firstChecked && secondChecked) {
                    continueAdd($form);
                } else {
                    showError($form.find('.errorCartNenza'));
                }
            } else if (hasFirst) {
                if (firstChecked) {
                    continueAdd($form);
                } else {
                    showError($form.find('.errorCartNenza'));
                }
            } else {
                continueAdd($form);
            }

            function continueAdd(form) {
                if (form.hasClass('dont-stock')) return;

                const id = form.data('id');
                const quant = form.find('input[type="number"]').val();
                const validaApi = form.data('api-cart');
                let href, variant;

                if (form.hasClass('page-product-cart')) {
                    href = form.attr('data-prodlink');
                    variant = form.data('variants').length ? jQuery('#selectedVariant').val() : 0;
                } else {
                    href = form.parents('.product').find('> a').attr('href');
                    variant = form.data('variants').length ? form.find('input[type="number"]').attr('data-variant') : 0;
                }

                cart.addToCart(id, quant, variant, href, validaApi);
            }
        });
    },

    submitAdd: function () {

        jQuery('.add-cart-modal').on('submit', 'form', function (e) {
            e.preventDefault();
            var productId = jQuery(this).find('#product_modal').val();
            var quant = jQuery(this).find('#quant_modal').val();
            var variant = jQuery(this).find('#variant_modal');

            if (variant.hasClass('required')) {
                jQuery('#alert-modal-add').removeClass('tray-hide')
                return;
            }

            jQuery('.action-add .add-cart').attr('disabled');

            cart.addVariantComplete(variant.val(), quant, productId);

        });
    },
    addToCart: function (productId, quantity, variant, href, valApi) {
        console.log("add to cart")
        if (valApi == 1) {

            cart.loadCustomerId();

            const data = {
                Cart: {
                    session_id: cart.session(),
                    product_id: productId,
                    variant_id: variant ? variant : 0,
                    quantity: quantity
                }
            };

            if (cart.customerId) {
                data.Cart.customer_id = cart.customerId;
            }

            jQuery.ajax({
                method: 'post',
                url: '/web_api/cart/',
                dataType: 'json',
                data: data,
                success: function () {
                    cart.showCart();
                },
                error: function (error) {
                    // window.location.href = href;
                    jQuery('#errorCartNenza span').html(error.responseJSON.causes);
                    jQuery('#errorCartNenza').addClass('ativo');

                    setTimeout(function () {
                        jQuery('#errorCartNenza span').html('');
                        jQuery('#errorCartNenza').removeClass('ativo');
                    }, 5000);


                }
            });
        }
        else {
            const storeId = jQuery('html').data('store');
            const callback = encodeURIComponent(`/loja/carrinho.php?loja=${storeId}&acao=incluir&IdProd=${productId}&variacao=${variant ? variant : 0}`);

            jQuery.ajax({
                method: 'post',
                url: `/mvc/store/element/snippets/cart_preview/?loja=${storeId}&callback=${callback}`,
                data: {
                    quant: quantity
                },
                success: function () {
                    cart.showCart();
                },
                error: function (error) {
                    jQuery('#errorCartNenza span').html(error.responseJSON.causes);
                    jQuery('#errorCartNenza').addClass('ativo');

                    setTimeout(function () {
                        jQuery('#errorCartNenza span').html('');
                        jQuery('#errorCartNenza').removeClass('ativo');
                    }, 5000);
                    // window.location.href = href;
                }
            });
        }

    },
    ajaxGet: function (url, result) {

        jQuery.ajax({
            method: "GET",
            url: url,
            success: function (response) {
                result(response);
            },
            error: function (jqXHR, status, errorThrown) {
                result({ error: true });
                var response = JSON.parse(jqXHR.responseText);
            }
        });
    },


    checkFirstVariantStock: function () {
        var variants = document.querySelectorAll(".list-variants");

        variants.forEach((vars) => {
            let data = vars.dataset.variants;

            // Verifica se é um JSON válido
            if (!data || data === "sem") return; // pula esse item

            let variant;
            try {
                variant = JSON.parse(data);
            } catch (e) {
                console.warn("Erro ao fazer parse do dataset.variants:", e, data);
                return; // pula esse item com JSON inválido
            }

            // Continua o processamento
            variant.sort((a, b) => a.stock - b.stock);

            const inputVariantFirst = jQuery(vars).find(".first");
            for (let i = 0; i < inputVariantFirst.length; i++) {
                for (let j = 0; j < variant.length; j++) {
                    if (variant[j].option == inputVariantFirst[i].value) {
                        if (!checkaStock(variant[j])) {
                            inputVariantFirst[i].closest('label').classList.add("out-stock");
                        } else {
                            inputVariantFirst[i].closest('label').classList.remove("out-stock");
                        }
                    }
                }
            }

            function checkaStock(obj) {
                return obj.stock > 0;
            }
        });

    },

    removeProduct: function (element) {
        jQuery(element).closest(".box-cart").addClass('load-remove');

        var id = parseInt(jQuery(element).attr('data-id'));
        var variant = '/' + jQuery(element).attr('data-variant');
        var together = jQuery(element).attr('data-together') !== '' ? '/' + jQuery(element).attr('data-together') : '';
        var addText = jQuery(element).attr('data-add') == "" ? '' : jQuery(element).attr('data-add');

        jQuery.ajax({
            method: "DELETE",
            url: "/web_api/carts/" + cart.session() + "/" + id + variant + together + "?" + jQuery.param({ "additional_information": addText })
        }).done(function (response) {
            cart.listProduct();
        }).fail(function (error) {
            cart.listProduct();
        });
    },
    listProduct: function () {
        jQuery.ajax({
            method: 'GET',
            url: '/checkout/cart/api?session_id=' + cart.session() + '&store_id=' + cart.idStore() + '&nocache=0.' + new Date().getTime(),
            success: function (r) {
                var forList = r.data.cart.products;
                var addList = [];
                forList.forEach(function (list) {
                    addList.push({
                        "Cart": {
                            "email": "",
                            "variants_kit": list.variants_kit || "",
                            "additional_info_kit": list.additional_info_kit || "",
                            "price_itens_kit": list.price_itens_kit || "",
                            "product_id": list.id,
                            "product_name": list.name,
                            "quantity": list.quantity,
                            "price": list.price,
                            "variant_id": list.variant_id || "0",
                            "variant_name": list.variant,
                            "additional_information": list.additional_information,
                            "product_url": list.url,
                            "bought_together_id": list.bought_together_id || "",
                            "product_image": list.images // alter images template
                        }
                    })
                });

                cart.forProduct(addList);
            },
            error: function () {
                cart.forProduct([]);
            }
        });
    },
    number: function (number) {

        jQuery('.cart-header .number').text(number);
    },
    total: function (price) {

        // Atualiza o texto com o valor formatado
        jQuery('.cart-sidebar .total .value').text(toReal(parseFloat(price), 'R$'));

        // Pega o valor total necessário para frete grátis
        var value_barra = jQuery('.cart-sidebar .total').data('total');

        // Converte os valores para número e calcula a porcentagem
        var porcentagem = (parseFloat(price) / parseFloat(value_barra)) * 100;

        // Garante que a porcentagem não ultrapasse 100%
        porcentagem = Math.min(porcentagem, 100);
        var restante = value_barra - price;


        jQuery('.cart-sidebar .bar-value .progresso').css('width', porcentagem + '%');

        if (porcentagem >= 100) {
            jQuery('.cart-sidebar .text-sucesso').addClass('active');
            jQuery('.cart-sidebar .text-value').removeClass('active');

        } else {
            jQuery('.cart-sidebar .text-value .recebe-valor').text(toReal(parseFloat(restante), 'R$'));
            jQuery('.cart-sidebar .text-sucesso').removeClass('active');
            jQuery('.cart-sidebar .text-value').addClass('active');

        }

        // Exibe no console com 2 casas decimais
        console.log('Porcentagem da barra de frete:', porcentagem.toFixed(2) + '%');

    },
    forProduct: function (listProducts) {

        var listDom = jQuery('.cart-sidebar .content-cart .list');
        listDom.find('*').remove();
        listDom.parent().removeClass('empty');

        var qnt = 0;
        var total = 0.0;
        var listId = [];
        if (listProducts.length) {

            listProducts.forEach(function (product) {
                product = product.Cart;

                var addMsg = product.additional_information;
                prices = product;
                // product.productImage.thumbs[90].https;
                listDom.append(cart.templateProduct(product.product_id, product.variant_id, product.variant_name, product.product_name, product.product_image.small, product.quantity, product.price, product.product_url.https, addMsg, product.additional_info_kit, product.bought_together_id));
                qnt += parseInt(product.quantity);

                total += (parseFloat(product.price) * parseInt(product.quantity));

                listId.push(parseInt(product.product_id));

            });
            cart.number(qnt);
            cart.total(total);

            let valorMinimoCompra = jQuery('.footer-cart .total').data('total')
            let listDomPreco = jQuery('.cart-sidebar .footer-cart .text-info');
            let porcentagemConcluida = Math.min((total / valorMinimoCompra) * 100, 100);
            let existPriceRuler = listDomPreco.find('#priceRuler')

            // if(total < valorMinimoCompra){
            //     jQuery('.footer-cart .line').hide()

            //     if(existPriceRuler.length === 0){
            //         listDomPreco.append(`
            //         <div class="box_valor_minimo">
            //             <div id="priceRuler">
            //                 <div id="filler"></div>
            //             </div>
            //             <div class="minimum_price">Valor m&#x00ED;nimo para compra: ${toReal(valorMinimoCompra, 'R$')} </div>
            //         </div>
            //         `)

            //     }    
            //     jQuery('#filler').width(porcentagemConcluida + '%');  

            // }else{
            //     jQuery('.footer-cart .line').show()
            //     jQuery('.footer-cart .box_valor_minimo').remove()
            // }

        } else {
            listDom.append('<div class="error"><div clas="text">Carrinho Vazio</div></div>');
            listDom.parent().addClass('empty');
            cart.number(0);
            cart.total(0);

            jQuery('body').find('.add-cart .buy-product').each(function () {
                if (jQuery(this).hasClass('active')) jQuery(this).removeClass('active').find('.text').text('Comprar');
            });

        }
    },
    startCart: function () {

        jQuery('.cart-header').on('click', function () {
            if (jQuery(this).parent().hasClass('active')) {
                jQuery('.cart-header').removeClass('active');
                jQuery('.cart-sidebar').removeClass('active');

            } else {
                cart.showCart();
            }

        });

        jQuery('body').on('click', '.shadow-cart, .shadow-cart-header, .box-prev, .close-nav,.box-fixed .close-box,.close-modal,.close-icon,.modal-theme .shadow', function (e) {
            jQuery('.cart-sidebar, .nav-mobile,.box-fixed,.modal-theme,.cart-header').removeClass('active');
        });
        jQuery(document).keyup(function (e) {
            if (e.key === "Escape") {
                jQuery('.cart-sidebar, .nav-mobile,.box-fixed,.modal-theme,.cart-header').removeClass('active');

            }
        });

        this.initAdd();

        if (jQuery("html").hasClass("page-product")) {
            var btnFirstVariation = jQuery('.page-product-cart').find('.first');
            var variantsProduct = jQuery('.page-product-cart').data('variants');



        }
        // add product variant
        jQuery('.product-submit').on('submit', function (e) {
            e.preventDefault();
            var variant = jQuery(this).find('.select').val();
            var quantity = jQuery(this).find('.quantity').val();
            var product_id = jQuery(this).find('.quantity').attr('data-id');
            if (variant) cart.addVariantComplete(variant, quantity, product_id);
        });

        jQuery('.remove-items').on('click', function () {
            cart.removeCart();
        });

    },

    addOnPageProduct: function () {
        jQuery('#form_comprar').on('submit', function (e) {
            e.preventDefault();
            var inputVariatnId = jQuery(this).find('#selectedVariant').value;
            var formSubmit = jQuery(this).find('button[type="submit"] span');

            jQuery(formSubmit).text('Adicionando...').addClass('load');

            if (inputVariatnId != undefined || inputVariatnId != null || inputVariatnId != '') {
                setTimeout(function () {
                    jQuery(formSubmit).text('Sucesso!').removeClass('load');
                    cart.showCart();
                    jQuery(formSubmit).text('Comprar');
                }, 1200);
            }
            else {
                jQuery(formSubmit).text('Comprar').removeClass('load');

            }
        });
    }
}

function process(step) {
    const input = document.querySelector('.quanti-var');
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.getAttribute('min')) || 1;
    const max = parseInt(input.getAttribute('max')) || Infinity;

    let newValue = currentValue + step;

    // Garante que o novo valor esteja entre min e max
    if (newValue >= min && newValue <= max) {
        input.value = newValue;
    }
}

jQuery(function () {
    cart.startCart();
    cart.checkFirstVariantStock();

    if (jQuery('body').hasClass('page-product')) {
        cart.addOnPageProduct();
    }
});



jQuery(document).ready(function () {
    var shadow = jQuery('.shadow-float-add-cart');

    jQuery('[data-item]').each(function () {
        var item = jQuery(this);
        var id = item.data('item');

        item.on('click', function () {
            // Remove todos os ativos antes
            jQuery('[data-open]').removeClass('active');
            shadow.removeClass('active');

            // Ativa apenas o correspondente
            var target = jQuery('[data-open="' + id + '"]');
            if (target.length) {
                target.addClass('active');
                shadow.addClass('active');
            }
        });
    });

    shadow.on('click', function () {
        jQuery('[data-open]').removeClass('active');
        shadow.removeClass('active');
    });
});
