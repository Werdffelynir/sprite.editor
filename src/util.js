
/**
 *
 * @param attr
 * @param html
 * @param stack
 * @returns {{HTMLElement}}
 */
export function searchAttr(attr, html, stack = false) {
    let i = 0;
    const elems = Array.from(html.querySelectorAll('[' + attr + ']'));
    const elemsstack = {};
    while (elems.length > i) {
        const a = elems[i].getAttribute(attr);
        if (a.length === 0) {
            if (stack) {
                if (!Array.isArray(elemsstack[attr])) elemsstack[attr] = [];
                elemsstack[attr].push(elems[i]);
            } else {
                elemsstack[attr] = elems[i];
            }
        } else {
            elemsstack[a] = elems[i];
        }
        i++;
    }
    return elemsstack;
}

/**
 *
 * @param element
 * @param image
 */
export function cssBackgroundImage(element, image) {
    element.style.backgroundImage = "url('" +image+ "'";
}

export function isObject (value) {
    return typeof value === 'object' && value !== null
}

export function createElement(tag, attrs, inner, styles) {
    const
        element = document.createElement(tag),
        is_attr = function (src) {
            return typeOf(src, 'object') && !isNode(src)
        },
        insert_html = function (src) {
            element.insertAdjacentHTML('beforeend', src);
        },
        insert_child = function (src) {
            element.appendChild(src);
        },
        insert = function (src) {
            const type = typeOf(src);
            if (type === 'string')
                insert_html(src);
            else if (type === 'object' && isNode(src))
                insert_child(src);
            else if (type === 'array')
                for (let i = 0; i < src.length; i++) insert(src[i]);
        };

    if (arguments.length === 2 && !is_attr(attrs)) {
        inner = attrs;
        attrs = false;
    }

    if (attrs)
        Object.keys(attrs).forEach((key) => {
            if (key === 'style' && isObject(attrs[key])) {
                styles = styles ? {...styles, ...attrs[key]} : attrs[key];
            } else {
                element.setAttribute(key, attrs[key])
            }
        });

    if (styles)
        Object.keys(styles).forEach((key) => { element.style[key] = styles[key] });

    if (inner)
        insert(inner);

    return element;
}

export function isNode(value) {
    return value && (value.nodeType === Node.TEXT_NODE ||
        value.nodeType === Node.ELEMENT_NODE ||
        value.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
        value.nodeType === Node.DOCUMENT_NODE)
}

export function typeOfStrict(value, type) {
    const t = Object.prototype.toString.call(value).slice(8, -1);
    return typeof type === 'string' ? type === t : t;
}

export function typeOf(value, type = null) {
    const simpleTypes = ['null', 'boolean', 'undefined', 'function', 'string', 'number', 'date', 'array', 'object'];
    let t = typeOfStrict(value).toLowerCase();
    if (simpleTypes.indexOf(t) === -1 && typeof value === 'object')
        t = 'object';

    return typeof type === 'string' ?
        type.toLowerCase() === t : t;
}


/**
 * Formatting of string, or maybe template builder
 *
 * Examples:
 * .format("Hello {0}, your code is {1}!", ['Jade', 'Prefect']);
 *
 * .format("Hello {name}, your code is {mean}!", {name:'Jade', mean: 'Prefect'});
 *
 * @param string    String
 * @param list  Array|Object
 * @returns string
 */
export function format (string, list) {
    let reg;
    if (Array.isArray(list))
        reg = new RegExp(/{(\d+)}/g);
    else if (list && typeof list === 'object')
        reg = new RegExp(/{(\w+)}/g);

    return string.replace(reg, function (match, number) {
        return typeof list[number] !== undefined ? list[number] : match;
    });
}


/**
 * Added styles to element as attributes
 *
 * <pre>
 * Example:
 *  const styleObject = {background: 'black', paddingTop: '10px' };
 *
 *  stylizer ( NodeElement,  styleObject );
 *
 * </pre>
 *
 * @param {HTMLElement|String} element
 * @param {CSSStyleDeclaration|{}} styles
 */

export function addStyle(element, styles)
{
    if (typeOf(element, 'string')) {
        element = document.querySelector(element);
    }

    Object.keys(styles).forEach((key) => {
        if (element.style[key] !== undefined) {
            element.style[key] = styles[key];
        }
    });

    return element;
}


export function copyCanvas(sourceCanvas)
{
    const destinationCanvas = document.createElement('canvas');
    destinationCanvas.width = sourceCanvas.width;
    destinationCanvas.height = sourceCanvas.height;
    const destCtx = destinationCanvas.getContext('2d');
    destCtx.drawImage(sourceCanvas, 0, 0);
    return destinationCanvas;
}

/**
 *
 * @param {{}} data
 * @param {String} filename
 * @param {String} file_type    json | text | png | jpg | gif
 */
export const download = (data, filename, file_type = 'text') => {
    data = JSON.stringify(data)
    const link = document.createElement('a')
    switch (file_type) {
        case 'json':
        case 'text':
            file_type = 'data:text/plain;charset=utf-8'
            break;
        case 'jpg':
        case 'jpeg':
            file_type = 'data:image/jpeg;base64'
            break;
        case 'png':
            file_type = 'data:image/png;base64'
            break;
        case 'gif':
            file_type = 'data:image/gif;base64'
            break;
        case 'webp':
            file_type = 'data:image/webp;base64'
            break;
    }

    link.setAttribute('href', file_type + ',' + encodeURIComponent(data))
    link.setAttribute('download', filename || 'data.json')
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}











